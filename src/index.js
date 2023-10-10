/*import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from '@aws-sdk/client-s3';*/

import core from '@actions/core';
import { glob } from 'glob';

const SOURCE = core.getInput('source');
const DESTINATION = core.getInput('destination');
const IGNORE = core.getInput('ignore');
const BUCKET_NAME = core.getInput('bucket');
const ACCESS_KEY_ID = core.getInput('access_key');
const SECRET_ACCESS_KEY = core.getInput('secret_key');
const REGION = core.getInput('region');

async function getFiles(src, ignore) {
  const files = await glob(src, { ignore, signal: AbortSignal.timeout(10000), withFileTypes: true });
  return files.filter((file) => !file.isDirectory()).map((file) => file.fullpath());
}

getFiles(SOURCE, IGNORE)
  .then((files) => {
    core.info(`Uploading ${files.length} files to ${BUCKET_NAME}:\n${files.join('\n')}`);
  })
  .catch((err) => {
    core.error(err);
    core.setFailed(err.message);
  });
