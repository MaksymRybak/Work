Amazon Web Services useful tips

AWS core services: 
1) EC2 - Elastic Cloud Computing
Select AMI (Amazon Machine Image) to create a new instance.
Auto Scaling Group to increase and decrease the number of instances. Scaling AMIs.
Elastic Block Storage - storage.
Security group - aka firewall. To allow access between EC2 instances, allow access to Databases, accept HTTP requests.

2) S3 - Simple Storage Service
To store files, max file size is 5TB.
We create buckets.
We can host static websites.

3) RDS - Relational Database Service
Take snapshots. Security control using security groups.
Config access from EC2 instance.
NoSQL database as DynamoDB and Redshift.

4) Route53 - DNS service
We can setup domain and subdomains.
We can buy a new domain name.
Add domain records.

5) Elastik Beanstalk
Used to deploy code on EC2
Easy deploy with various tools.
Set it and forget it configuration.
Aggregated monitoring and logging.
We can deploy different versions on different environments (Test, Production).
Application versions are stored in S3 bucket.
Monitoring tools to see CPU, Number of requests and Network traffic.
NOTA: ELASTIC BEANSTALK IS FREE SERVICE, WE ONLY PAY FOR EC2, S3 AND LOAD BALANCERS.

6) DynamoDB
NoSQL Database. KeyValue store.
Base object is Table.
We read and write 4KB / unit.
First 25GB of stored data is free.
We pay for num. of reads and writes.

7) RedShift
Data warehousing solution.
For BI tools. 
We can push data to RedShift from RDS, DynamoDB, S3 to simplfy future analysis.
Data is pushed to RedShift using Data Pipeline ETL process.
Based on cluster (many nodes)
Good security settings.

8) VPC - Virtual Private Cloud
To increase security of our resources on AWS.
We can configure Routing tables, NAT gateways, internal IP address allocation.
VPC can include public and private subnets.
Request flow: Internet -> Routing table (control what goes where) -> Network ACL (Access Control List) to control who can come and go -> VPC
Basic VPC configuration is FREE.

9) Cloud Watch 
Used for monitoring of AWS resources (EC2, DynamoDB, S3, Route53, RedShift)
We can set metrics and threshold.
When something happened we will be notified by SMS or Email or we can program some auto scaling operations.
We can install awslogs agent on EC2 and configure to send logs to Cloud Watch.
Filter logs and send notifications when some specific event has occurred.
We pay for alarms, ingesting logs, archived logs, dashboards.

10) Cloud Front - CDN service
Cloud Front works with EC2, S3, Load Balancers, Route53.
We define distribution and specify original location (eg S3).
Every distribution has unique Url to use for retrieving content.
Pay for outgoing data based on the region.


