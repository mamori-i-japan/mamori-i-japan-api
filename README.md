# NestJS Serverless App

This is a proof-of-concept app which utilizes the following projects/technologies.

### Primary Tasks for PoC

- [NestJS](https://github.com/nestjs/nest) - NodeJS Framework.
- [Serverless](https://github.com/serverless/serverless) - Build applications with serverless architectures using AWS Lambda.
  - [Provisioned Lambda](https://aws.amazon.com/about-aws/whats-new/2019/12/aws-lambda-announces-provisioned-concurrency/) - We would like to use provisioned lambda this time.
- [Cloud Firestore](https://firebase.google.com/docs/firestore) - flexible, scalable NoSQL cloud database.
- [Firebase Auth](https://firebase.google.com/docs/auth) - User management
  - We now have an implementation of `Firebase Auth` `Guard`.
- Push Notification
  - Sending messages to all users. Scalability is very important.
- Push Data
  - Do we need Data push feature to spread affected people list using tech like Firebase Firestore?

### Progress of PoC

| Technology        | Sub-task           | Progress    |
| ----------------- | ------------------ | ----------- |
| NestJS            | -                  | In-Progress |
|                   | Initial Setup      | Done        |
|                   | Lambda Handler     | Done        |
|                   | Swagger            | Done        |
| Serverless        | -                  | Done        |
|                   | Lambda deployment  | Done        |
|                   | Provisioned Lambda | Done        |
| Firestore         | -                  | In-Progress |
| Firebase Auth     | -                  | Done        |
| CI/CD support     | -                  | Done        |
|                   | CircleCI Config    | Done        |
|                   | CircleCI github    | In-Progress |
| Push Notification | -                  | Not Started |
|                   | FCM                | -           |
| Push Data         | -                  | Not Started |
|                   | Firestore          | -           |

### Secondary Tasks for PoC

- `docker-compose` - It would be good to have it for local development.
  - This would be a good alternative since `serverless offline` does not support hot-reload (at least the way it's implemented right now in this repo). This should consider the use of `offline DynamoDB or Firestore?`.
- `Swagger/openapi` - Investigate how to auto-generate it with decorators, etc. (We should not think about maintaining it manually).
- `Stages` - Configure various deployment stages like `dev`, `stg`, `prd`.
- `APIGateway` - Configure domain routing, etc. via `serverless` resources (we do not need `terraform` if we can do all config via `serverless` YAML.)

## Installation

```bash
$ npm install
```

- Make sure you add the `env` values in `.env` file. Just copy the `.env.template` file.
- Make sure you download the `serviceAccountKey.json` file and add it to root.
  - Official doc [link](https://firebase.google.com/docs/admin/setup#initialize-sdk).

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the app in serverless offline mode

```bash
$ npm run sls-offline
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deploying the app

- In the future we will deploy via `CircleCi`, but for local deployment to `dev`, run:

```bash
npm run deploy:dev
```

### Project Layout (Brief explaination)

```
.
├── .env (Make sure to create this file locally and fill the env vars)
├── .serviceAccount.json (Make sure to get this file for firebase admin SDK)
├── src
|   ├── main.ts (This entry point is used for local server)
|   ├── lambda-main.ts (This entry point is used for lambda server)
|   ├── auth (module)
|       ├── guards
|       └── strategies (Implementation of Firebase Auth access token check)
|   └── users (module)
|       ├── users.service.ts (Services can call other services and their own repository)
|       └── user.repository.ts (Repositroy should be called only by its parent service)

```

As mentioned briefly in the project layout for `users`, to keep layout clean, we follow this convention:

1. Controllers: HTTP routes map to handler functions in controllers.
2. Services: Controllers call their service function.  
   A) A `user controller` must call only a `user service`, and not any other service if it can be avoided.  
   B) A `user service` can call other services like `cats service`, etc.  
   C) A `user service` must call only a `user repository`, and not any other repository if it can be avoided. If a `user service` wants to modify data in `cats repository`, it must call corresponding `cats service` funtion to do it.
3. Repositories: Repositories have data layer implementation, ex: `Firestore` in this project. They must be called only by their direct parent service, ex: A `user repository` is called by a `user service`.

## Contributors

- [Yash Murty](https://github.com/yashmurty)
- [Shogo Mitomo](https://github.com/shogo-mitomo)
