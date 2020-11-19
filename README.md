# csvql

A module to quickly query CSV data as a SQL

Similar packages:

(Node) [tables](https://www.npmjs.com/package/tables)
(Go) [textql](https://github.com/dinedal/textql)

## Installation

### CLI

npm:

```bash
npm install --global csvql
```

yarn:

```bash
yarn add global csvql
```

### API

npm:

```bash
npm install csvql
```

yarn:

```bash
yarn add csvql
```

## Usage

This module can be used in two formats: CLI and API.

### CLI

#### Create session
To start the application you use this command on terminal:

```bash
csvql [path/to/file1.csv[ path/to/file2.csv [...]]]
```

##### Arguments

Each argument needs to point to a CSV file.

##### Flags

* ``-p | --persist``: Create a disk database with the data when the session is closed. Values: ``<session-name> | null``. If null a random name will be used;
* ``-d | --delimiter``: The delimiter of the CSV file. Default is ``,``. Values: ``<delimiter>``;
* ``-D | --disk``: Create the session on a in-disk database, useful when the CSV is too large to a in-memory database;
* ``-f | --from``: Restart a persistent session in-memory. Values: ``<session-name>``; If invalid the startup will be aborted;
* ``--verbose``: Show top level JavaScript errors if they occur.

After that the interactive terminal of csvql will start.

#### Commands
The CLI have 4 commands:

##### Help
Prints all the available commands.

```
csvql> help
select <sql query>: Queries into imported schemas.
schema <operation>: Manage the schemas of the current session.
  list: List all tables and columns available.
  import <path [as <tableName>[, ...]]>: Import a new schema from CSV file(s).
  drop <tableName>: Delete a table of the current session.
help: List all available commands.
exit: Close the current session.
```

##### Exit
Close the application, equivalent of ``^C``.

##### Schema
Manages the schemes on the current session

**Operations**

*list*
List all the tables on current session, with the types.

*import*
Import CSV files, follows the syntax:
```
csvql> schema import path/to/file.csv [as table] [, ...]
```

*drop*
Delete a table on current session.

##### Select
SQL SELECT Query, from [sqlite](https://www.sqlite.org/index.html).

### API

**WIP**