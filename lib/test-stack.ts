import * as cdk from "aws-cdk-lib";
import { aws_s3 as s3 } from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Effect, PolicyStatement, StarPrincipal } from "aws-cdk-lib/aws-iam";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { Duration } from "aws-cdk-lib";
export class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const inputBucket = new s3.Bucket(this, "inputBucketCSR", {
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: false,
        blockPublicPolicy: false,
      },
    });

    inputBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["s3:GetObject"],
        effect: Effect.ALLOW,
        principals: [new StarPrincipal()],
        resources: [inputBucket.arnForObjects("*")],
      })
    );

    const outputBucket = new s3.Bucket(this, "outputBucketCSR", {
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: false,
        blockPublicPolicy: false,
      },
    });

    outputBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["s3:GetObject"],
        effect: Effect.ALLOW,
        principals: [new StarPrincipal()],
        resources: [outputBucket.arnForObjects("*")],
      })
    );

    // const vpc = new ec2.Vpc(this, "VpcCSR", {
    //   subnetConfiguration: [
    //     {
    //       name: "publicSubnet",
    //       subnetType: ec2.SubnetType.PUBLIC,
    //     },
    //   ],
    //   natGateways: 0,
    // });

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

    new s3Deployment.BucketDeployment(this, "websiteDeploy", {
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

    // const cluster = new ecs.Cluster(this, "MyCluster");

    // const fargateTask = new ecs.FargateTaskDefinition(this, "FargateTaskCSR", {
    //   cpu: 256,
    //   memoryLimitMiB: 512,
    // });

    // fargateTask.addContainer("GinContainer", {
    //   image: ecs.ContainerImage.fromAsset("./customer-statement-processor"),
    //   environmentFiles: [ecs.AssetEnvironmentFile.fromAsset("test.env")],
    //   portMappings: [{ containerPort: 8000 }],
    // });

    // const mySecurityGroupWithoutInlineRules = new ec2.SecurityGroup(
    //   this,
    //   "SecurityGroup",
    //   {
    //     vpc,
    //     description: "Allow ssh access to ec2 instances",
    //     allowAllOutbound: true,
    //     disableInlineRules: true,

    //   }
    // );
    // //This will add the rule as an external cloud formation construct
    // mySecurityGroupWithoutInlineRules.addIngressRule(
    //   ec2.Peer.anyIpv4(),
    //   ec2.Port.tcp(8000),
    //   "allow ssh access from the world"
    // );

    // // Create a load-balanced Fargate service and make it public
    // const loadBalance = new ecs_patterns.ApplicationLoadBalancedFargateService(
    //   this,
    //   "MyFargateService",
    //   {
    //     cluster: cluster, // Required
    //     taskSubnets: {
    //       subnetType: ec2.SubnetType.PUBLIC,
    //     },
    //     cpu: 512, // Default is 256
    //     desiredCount: 6, // Default is 1
    //     taskDefinition: fargateTask,
    //     memoryLimitMiB: 2048, // Default is 512
    //     publicLoadBalancer: true, // Default is true
    //     assignPublicIp: true,
    //     listenerPort: 8000,
    //     securityGroups: [mySecurityGroupWithoutInlineRules],

    //   }
    // );

    // loadBalance.targetGroup.configureHealthCheck({
    //   healthyThresholdCount: 2,
    //   unhealthyThresholdCount: 4,
    // });

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
          image: ecs.AssetImage.fromAsset("."),
          containerPort: 8000,
          environment: {
            AWS_ACCESS_KEY_ID: "AKIAQ3EGUOJUPNUWLHW7",
            AWS_SECRET_ACCESS_KEY: "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",
            AWS_REGION: "eu-west-1",
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
      value: webSiteBucket.bucketName!,
    });
  }
}
