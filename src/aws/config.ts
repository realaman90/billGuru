import aws from 'aws-sdk';
import crypto from 'crypto';


//S3 upload refactor later
const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const S3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

export async function generateUrl() {
    const fileName = crypto.randomBytes(16).toString('hex');
    const params = ({
        Bucket: bucketName,
        Key: 'a3organics/'.concat(fileName).concat('.jpg'),
        Expires: 60
    })
    const uploadURL = await S3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}
