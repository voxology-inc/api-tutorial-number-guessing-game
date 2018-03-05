Welcome to Voxology's CallFlows QuickStart!
=============================================

In the project bundle you will find a basic NodeJS web server to
handle the REST requests that the CallFlows platform requires
for its innovative Callback Loop functionality.

>**NOTE**: The build script for this code compiles it into a package for an AWS ElasticBeanstalk instance. Please make changes to the build script accordingly for other hosting services.

### Installation
1. Install [Node](https://nodejs.org/en/) globally
2. Familiarize yourself with provisioning a phone number using the [PhoneNumbers API](https://voxolo.gy/api-reference/#list-available-inbound-numbers) and configuring a phone number to your web server using the [CallFlows API](https://voxolo.gy/api-reference/#update-call-flow-configuration)
3. Run `npm install` in the project root directory to install required dependencies
4. Run `npm run start` to run the local web server at `localhost:3000`

### Deployment:
1. Run `npm run build` to create a deploy-able version of your project
2. Deploy the zipped file inside the `dist` directory to an AWS ElasticBeanstalk instance