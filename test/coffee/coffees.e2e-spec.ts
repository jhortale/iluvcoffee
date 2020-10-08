import { INestApplication, ValidationPipe, HttpStatus, HttpServer } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from 'src/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  const expectedPartialCoffee = jasmine.objectContaining({
    ...coffee,
    flavors: jasmine.arrayContaining(
      coffee.flavors.map(name => jasmine.objectContaining({ name })),
    ),
  });
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
    httpServer = app.getHttpServer();
  });

  it('Create [POST /]', async () => {
    const { body } = await request(httpServer)
      .post('/coffees')
      .send((coffee as CreateCoffeeDto))
      .expect(HttpStatus.CREATED);
    expect(body).toEqual(expectedPartialCoffee);
  });

  it('Get all [GET /]', async () => {
    const { body } = await request(httpServer)
      .get('/coffees');
    console.log(body);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toEqual(expectedPartialCoffee);
  });

  it('Get one [GET /:id]', async () => {
    const { body } = await request(httpServer)
      .get('/coffees/1');
    expect(body).toEqual(expectedPartialCoffee);
  });

  it('Update one [PATCH /:id]', async () => {
    const updateCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      name: 'New and Improved Shipwreck Roast'
    }
    const { body } = await request(httpServer)
      .patch('/coffees/1')
      .send(updateCoffeeDto);
    expect(body.name).toEqual(updateCoffeeDto.name);
    const { body: body_1 } = await request(httpServer)
      .get('/coffees/1');
    expect(body_1.name).toEqual(updateCoffeeDto.name);
  });

  it('Delete one [DELETE /:id]', async () => {
    await request(httpServer)
      .delete('/coffees/1')
      .expect(HttpStatus.OK);
    return request(httpServer)
      .get('/coffees/1')
      .expect(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    await app.close();
  });
});