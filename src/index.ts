import { Application } from './Application';
import IObserver from './entities/observer/interface/IObserver';
import UserGrpcServiceImpl from './grpc/service/UserServiceImp';
import GrpcServerAdapter from './GrpcServerAdapter';
import IApplication from './interface/IApplication';
import LRUCache from './modules/cache/class/LRUCache';
import dotenv from 'dotenv';
import UserService from './service/class/UserService';
import { NotificationServiceGrpcImpl } from './grpc/service/NotificationServiceImp';
import UserRepo from './repository/class/UserRepo';
import NotificationService from './service/class/NotificationService';

dotenv.config({
  path: './.env',
});

export const myEmail = 'rai@gmail.com';

// all the service related beans
const MAX_CACHE_SIZE = 5 * 10 ** 6;
export const lruCache = new LRUCache<IObserver>(MAX_CACHE_SIZE);

UserService.init(UserRepo.getInstance());
export const userGrpcService = new UserGrpcServiceImpl(UserService.getInstance());
export const notificationGrpcService = new NotificationServiceGrpcImpl(
  NotificationService.getInstance()
);

const PORT = 50012;
const HOST = '127.0.0.1';
const DB_URI = process.env.DATABASE_URL!;

// console.log(DB_URI);

async function bootstrap(appInstance: IApplication) {
  try {
    await appInstance.start();
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

const adapter = GrpcServerAdapter.grpc;
const app = Application.getInstance(adapter, PORT, HOST, DB_URI);

bootstrap(app);
