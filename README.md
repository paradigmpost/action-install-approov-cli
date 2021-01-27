# `install-approov-cli` GitHub Action

This repository contains an action for use with GitHub Actions, which installs the `approov` CLI.

`approov` is installed into `/home/runner/.approov` (or equivalent on Windows) and the `bin` subdirectory is added to the PATH.

## Usage

Install the latest version of the Approov CLI:

```yaml
- name: Install Approov CLI
  uses: bmc08gt/action-install-approov-cli@v1.0.1

- name: Run Approov Command
  run: approov whoami
  env:
    APPROOV_MANAGEMENT_TOKEN: "${{ secrets.APPROOV_TOKEN }}"
```
