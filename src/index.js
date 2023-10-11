/*import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from '@aws-sdk/client-s3';*/

const core = require('@actions/core');
const glob = require('@actions/glob');
const fs = require('fs');
const path = require('path');
const {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require('@aws-sdk/client-s3');

async function main() {
  // Get all the files and folders matching the glob pattern
  const source = core.getInput('source');
  const globber = await glob.create(source);

  let files = await globber.glob();

  // Filter out directories and map to their full path
  files = files.filter((file) => fs.lstatSync(file).isFile());

  // Convert to relative paths
  files = files.map((file) => path.relative(process.cwd(), file));

  // Log which files will be uploaded
  core.info(`Uploading ${files.length} files:\n ${files.join('\n')}`);

  // Create a new S3 client
  const REGION = core.getInput('region');
  const ACCESS_KEY_ID = core.getInput('access_key');
  const SECRET_ACCESS_KEY = core.getInput('secret_key');
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  });

  // Check if the bucket exists
  const BUCKET_NAME = core.getInput('bucket');
  core.info(`Verifying specified bucket exists.`);

  await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));

  // If the user specified that the destination should be cleared, delete all the files in the bucket at the destination first
  const DESTINATION = core.getInput('destination');
  const CLEAR_DESTINATION = core.getInput('clear_destination').toLowerCase().trim() === 'true';

  if (CLEAR_DESTINATION) {
    core.info(`Deleting all files with destination prefix ${DESTINATION}`);

    const objects = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: DESTINATION }));

    if (objects.Contents.length > 0) {
      const toDelete = objects.Contents.map(({ Key }) => ({ Key }));
      await s3.send(new DeleteObjectsCommand({ Bucket: BUCKET_NAME, Delete: { Objects: toDelete } }));
      core.info(`Deleted ${toDelete.length} files:\n ${toDelete.map(({ Key }) => Key).join('\n')}`);
    } else {
      core.info(`No files to delete.`);
    }
  }

  // Upload each file to the bucket
  core.info(`Uploading files...`);

  const promises = files.map(async (file) => {
    const key = path.join(DESTINATION, file);
    const content = fs.readFileSync(file);

    await s3.send(new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key, Body: content }));

    core.info(`Uploaded ${file} to ${key}`);
  });

  await Promise.all(promises);
}

main().catch((err) => {
  core.error(err);
  core.setFailed(err.message);
});
