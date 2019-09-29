import { Config, getStack, StackReference } from "@pulumi/pulumi";
import {RdsInstance} from "./database";
import * as aws from "@pulumi/aws";

const config = new Config();

export const dbUsername = config.require("dbUsername");
export const dbPassword = config.requireSecret("dbPassword");
export const dbName = config.get("dbName") || "";
const networkingStack = new StackReference(config.require("networkingStack"))

const baseTags = {
    Project: "Pulumi Demo",
    PulumiStack: getStack(),
};

const rds = new RdsInstance("db-instance", {
    description: `${baseTags.Project} DB Instance`,
    baseTags: baseTags,

    subnetIds: networkingStack.getOutput("dataVpcPrivateSubnetIds"),

    username: dbUsername,
    password: dbPassword,
    initalDbName: dbName,

    allocatedStorage: 40,
    engineVersion: "11.4",
    instanceClass: aws.rds.InstanceTypes.R3_Large,
    storageType: "gp2",

    finalSnapshotIdentifier: "my-final-snapshot",

    sendEnhancedLogsToCloudwatch: true,
    monitoringInterval: 10,

    securityGroupIds: [networkingStack.getOutput("peeredSecurityGroupId")],
});

export const dbEndpoint = rds.instanceEndpoint();
export const dbPort = rds.instancePort();
export const dbAddress = rds.instanceAddress();
