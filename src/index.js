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
  core.info(`Uploading ${files.length} files:\n${files.join('\n')}`);

  // Create a new S3 client

  // Check if the bucket exists

  // If the user specified that the destination should be cleared, delete all the files in the bucket at the destination first

  // Upload each file to the bucket
}

main().catch((err) => {
  core.error(err);
  core.setFailed(err.message);
});
