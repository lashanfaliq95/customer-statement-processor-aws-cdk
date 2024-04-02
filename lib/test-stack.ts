import * as cdk from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Effect, PolicyStatement, StarPrincipal } from "aws-cdk-lib/aws-iam";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const inputBucket = new s3.Bucket(this, "inputBucketCSR", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const outputBucket = new s3.Bucket(this, "outputBucketCSR", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const webSiteBucket = new s3.Bucket(this, "customerStatementFrontend", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: false,
        blockPublicPolicy: false,
      },
    });

    const deployedBucket=new s3Deployment.BucketDeployment(this, "websiteDeploy", {
      sources: [
        s3Deployment.Source.asset(
          path.join(__dirname, "..", "customer-statement-frontend", "build")
        ),
      ],
      destinationBucket: webSiteBucket,
    });

    webSiteBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["s3:GetObject"],
        effect: Effect.ALLOW,
        principals: [new StarPrincipal()],
        resources: [webSiteBucket.arnForObjects("*")],
      })
    );

    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 3, // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc,
    });

    // Create a load-balanced Fargate service and make it public
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "MyFargateService",
      {
        cluster: cluster, // Required
        cpu: 512, // Default is 256
        desiredCount: 1, // Default is 1
        taskImageOptions: {
          image: ecs.AssetImage.fromAsset("./customer-statement-processor"),
          containerPort: 8000,
          environment: {
            AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
            AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
            AWS_REGION:process.env.AWS_REGION!,
            INPUT_BUCKET_NAME: inputBucket.bucketName!,
            OUTPUT_BUCKET_NAME: outputBucket.bucketName!,
          },
        },
        memoryLimitMiB: 2048, // Default is 512
        publicLoadBalancer: true, // Default is true
        listenerPort: 8000,
        assignPublicIp: true,
      }
    );

    outputBucket.grantRead(service.taskDefinition.taskRole);
    inputBucket.grantRead(service.taskDefinition.taskRole);
    outputBucket.grantWrite(service.taskDefinition.taskRole);
    inputBucket.grantWrite(service.taskDefinition.taskRole);

    service.targetGroup.configureHealthCheck({
      path: "/",
      port: "8000",
    });

    service.taskDefinition.executionRole?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonEC2ContainerRegistryPowerUser"
      )
    );

    new cdk.CfnOutput(this, "inputBucketCSROutput", {
      value: inputBucket.bucketName!,
    });

    new cdk.CfnOutput(this, "outputBucketCSROutput", {
      value: outputBucket.bucketName!,
    });

    new cdk.CfnOutput(this, "frontendBucketCSROutput", {
      value: webSiteBucket.bucketWebsiteUrl!,
    });
  }
}
