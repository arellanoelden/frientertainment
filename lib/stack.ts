import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Distribution, AccessLevel } from "aws-cdk-lib/aws-cloudfront";
import { TableV2, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import {
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

export class MyAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 🪣 S3 bucket for the frontend
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 🚀 Deploy React build to S3
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, "..", "website", "build")),
      ],
      destinationBucket: websiteBucket,
    });

    const s3Origin = S3BucketOrigin.withOriginAccessControl(websiteBucket, {
      originAccessLevels: [AccessLevel.READ, AccessLevel.LIST],
    });

    // 🌩️ CloudFront Distribution
    new Distribution(this, "CloudFrontDist", {
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html", // Adjust to your root object
    });

    const postsTable = new TableV2(this, "posts", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "user",
        type: AttributeType.STRING,
      },
      tableName: "posts",
    });

    // 🧬 Lambda function (Python)
    const lambdaRole = new Role(this, "My Role", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        DynamoDBAccess: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ["dynamodb:PutItem"],
              resources: [postsTable.tableArn],
            }),
          ],
        }),
      },
    });

    const apiFunction = new lambda.Function(this, "ApiLambda", {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: "handler.lambda_handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "api")),
      role: lambdaRole,
    });

    // 🔌 API Gateway
    new apigateway.LambdaRestApi(this, "ApiGateway", {
      handler: apiFunction,
      proxy: true,
    });
  }
}
