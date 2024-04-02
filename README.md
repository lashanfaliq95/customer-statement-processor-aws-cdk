# Welcome to Customer Statement Processor 

This is a project to read csv/xml files,validate them and return the failed rows as a pdf.

**This has three main components**
1. aws cdk deployment environment
2. customer-statement-processor a typscript express server 
3. customer-statement-frontend a react frontend

## Try it now
This is currently deployed in the cloud using aws-cdk.

* `Front end website url` :  [Web site url](http://teststack-customerstatementfrontend6d400834-rv56s22lw2qb.s3-website-eu-west-1.amazonaws.com)
* `Server api url`:
[Far gate service url](http://TestSt-MyFar-NukoZDJCllml-1193326129.eu-west-1.elb.amazonaws.com:8000/)

<img width="1711" alt="Screenshot 2024-04-01 at 17 18 51" src="https://github.com/lashanfaliq95/customer-statement-processor/assets/20104168/d5ff6539-52c0-47bb-bd0d-aa132368aa78">
The image above depicts the react fronted hosted in the above link.

* On the left you can see the current files in the input bucket and on the right current files in the output s3. 
* You can upload a file to the input s3 using the upload box in the middle. Drag and drop or click on it and upload the file. You will see it appear in the left table. **If it does refreshing page will load the file**. 
* And finally, by pressing the *run job* button you can run the process to validate and a pdf file will be created in the right table/output bucket table with the records of the failed validation. 
* The download button next to the  file can be used to download any file.

**There are three ways two run this**
1. Local approach : Running the customer-statement-processor (typescript server) on localhost and reading and writing files from local directories.
2. Hybrid approach: Running the the customer-statement-processor(server) and customer-statement-frontend(webapp) on localhost, but connect to s3.
3. Cloud based approach : here the server and frontend will be deployed and read and write files to s3 buckets.


## Running project locally
![localRun drawio](https://github.com/lashanfaliq95/customer-statement-processor/assets/20104168/ad2af8b7-6bd5-4cd9-a234-049c36b9e57c)

Local approach is reading and writing files to local local directories. Here only the ./customer-statement-processor(server) is used.
This is a node express server running on port 8000. Once the server is running if we do a `POST http://localhost:8000/run-job-local` , it reads all files given in directory INPUT_DIRECTORY_NAME, does the needed validation and writes to the file OUTPUT_DIRECTORY_NAME.
Now go into the customer-statment-process folder
```
cd ./customer-statement-processor

```
Then create a .env file in that directory.

Example .env
```
INPUT_DIRECTORY_NAME=records
OUTPUT_DIRECTORY_NAME=output

```

This will read files given in INPUT_DIRECTORY_NAME in the .env file and write the result pdfs to OUTPUT_DIRECTORY_NAME found in the .env.

The below command will start the server and run it on **http://localhost:8000**.

```
npm install
npx ts-node -r dotenv/config  src/index.ts

```
Now since our server is up we can call the `/run-job-local` to start the processing of files from the input directory and write them to the output directory.

```
curl -X POST http://localhost:8000/run-job-local
```
To use docker to start the server use the below commands.

```
npm install
npm build
docker run --env-file ./.env -it -p 127.0.0.1:8000:8000  $(docker build -q .)
```
Here also the server will be accessible on http://localhost:8000


**Assumptions**

* The format of other csv/xml files will be similar to the given records. In sense of the fields sent, order sent etc.
* If a record has one field, all other fields will have values.

**Validation Logic**

For a given csv or xml file two validation are done.
1. The end balance field is equal to the sum of start balance and mutation
2. All the references are unique.

Finally, all records that fail either of the above will be inserted to a pdf which will be written to an output directory or output bucket.

The Validation logic is the same for running on cloud/locally. It's implemented by fileValidation function in './customer-statement-process/src/utils'.

Finally, we can get the result pdfs in the output directory.

**Running tests locally**

A few tests have been added to unit test the validation logic.

```
cd ./customer-statement-processor
npm run test
```


## Running project hybrid

We can stil run the project on localhost, but connect to the s3 buckets and not file directories by using an .env inside **customer-statement-processor** like shown below. The other steps remain the same. But now we need to call `POST http://localhost:8000/run-job-cloud` to start the job. To view output files here we need to start the customer-statement-frontend.
Example .env
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
INPUT_BUCKET_NAME=
OUTPUT_BUCKET_NAME=
```

APIs 
* `GET http://localhost:8000/` Health check
* `POST http://localhost:8000/run-job-cloud` Run job to process files in input bucket and write results to output bucket
* `POST http://localhost:8000/run-job-local` Run job to process files in input directory and write results to the output directory

  Used by the front end to display,upload and download files.
* `POST http://localhost:8000/upload-file/bucket/:bucketId` Upload file in body to given bucket
* `GET http://localhost:8000/bucket/:bucketId/:file` Get given file from bucket and file name
* `GET http://localhost:8000/file-list/bucket/:bucketId` List all files in given bucket

**Running the front end locally**

Now we need to go into the customer-statment-frontend folder.
```
cd ./customer-statment-frontend

```
Then create a .env file in that directory.

Example .env
```
SKIP_PREFLIGHT_CHECK=true
REACT_APP_INPUT_BUCKET_NAME=teststack-inputbucketcsr2d487c64-nq2znrhyrakn
REACT_APP_OUTPUT_BUCKET_NAME=teststack-outputbucketcsre20eaf00-xqovimumebjc
REACT_APP_BASE_URL=http://localhost:8000
```

Now we install modules and start the web app.
```
npm i
npm start
```

We can now view the website in http://localhost:3000

<img width="1711" alt="Screenshot 2024-04-01 at 17 18 51" src="https://github.com/lashanfaliq95/customer-statement-processor/assets/20104168/d5ff6539-52c0-47bb-bd0d-aa132368aa78">


## Running on cloud
Here both the server and the frontend will be hosted in the cloud and read and write to s3 buckets.

we need to create a .env here in the base path as well.

Example .env
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

```
![highlevelarchitecture drawio](https://github.com/lashanfaliq95/customer-statement-processor/assets/20104168/dbdd5ba1-750e-4499-b7b0-f3c359053233)

* You need to configure your local terminal with `aws configure` command.
* Go to root path and run `npm i`
* Run `cdk bootstrap` only once per account.
* Then `cdk deploy` to deploy our app, this will deploy the three buckets and the fargate container.

This will return the list of variables like shown below.
<img width="1205" alt="Screenshot 2024-04-01 at 21 05 39" src="https://github.com/lashanfaliq95/customer-statement-processor/assets/20104168/1696b5fe-4dfe-459a-988b-9e7c43b099d5">

Now we can get the website url from frontendBucketCsrOutput,inputBucketName from inputBucketCsroutput etc,outputBucketname from outBucketCsroutput and the server url or the record for the public loadbalancer and update .env file in ./customer-statement-processor and ./customer-statement-frontend .

An example for customer-statement-frontend .env.

Example .env
```
SKIP_PREFLIGHT_CHECK=true
REACT_APP_INPUT_BUCKET_NAME=${inputBucketCsroutput}
REACT_APP_OUTPUT_BUCKET_NAME=${outBucketCsroutput}
REACT_APP_BASE_URL=${fargateServiceUrl}:8000

```

An example for customer-statement-processor .env.

Example .env
```

INPUT_DIRECTORY_NAME=records
OUTPUT_DIRECTORY_NAME=output
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=eu-west-1
INPUT_BUCKET_NAME=${inputBucketCsroutput}
OUTPUT_BUCKET_NAME=${outBucketCsroutput}


```

Finally, run the following commands and all the processors should be working fine.
```
chmod +x ./build.sh
npm run build-all
cdk deploy

```





