const core = require('@actions/core');
const { execSync } = require('child_process');

try {
  // Fetch the latest changes from the remote repository
  execSync('git fetch');

  // Get the name of the current branch
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();

  // Try to merge the changes from the master branch into the current branch
  try {
    execSync(`git merge origin/master --no-commit --no-ff`);
    console.log('No merge conflicts detected');
  } catch (error) {
    // If the merge command fails, it means there are merge conflicts
    core.setFailed('Merge conflict detected');

    // Abort the merge to keep the repository in a clean state
    execSync('git merge --abort');
  }

  // Switch back to the original branch
  execSync(`git checkout ${currentBranch}`);
} catch (error) {
  core.setFailed(error.message);
}

