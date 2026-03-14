# task-tracker

A simple command-line interface (CLI) to track what you need to do, what you have done, and what you are currently working on. Part of the [Beginner's Projects](https://roadmap.sh/projects) on roadmap.sh, built to learn Backend Development.

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher

---

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker
```

**2. Run the script with node**

```bash
node index.js <arguments>
```

**3. Link it globally as `ttrack`**

```bash
npm link
```

> After this, you can run `ttrack` from anywhere in your terminal.

---

## Usage

```
ttrack <command> [arguments] [flags]
```

If you run `ttrack` with no arguments, it shows a welcome screen with your currently in-progress tasks.

---

## Commands

| Command            | Arguments            | Description                                   |
| ------------------ | -------------------- | --------------------------------------------- |
| `add`              | `<description>`      | Add a new task                                |
| `update`           | `<id> <description>` | Update a task's description                   |
| `delete`           | `<id>`               | Delete a task by ID                           |
| `list`             | `[status]`           | List all tasks, optionally filtered by status |
| `mark-in-progress` | `<id>`               | Mark a task as in-progress                    |
| `mark-done`        | `<id>`               | Mark a task as done                           |
| `mark-todo`        | `<id>`               | Reset a task's status back to todo            |

**Valid statuses:** `todo`, `in-progress`, `done`

---

## Flags

| Flag            | Short    | Description                              |
| --------------- | -------- | ---------------------------------------- |
| `--help`        | `-h`     | Show the help/manual                     |
| `--limit <n>`   | `-l <n>` | Limit the number of tasks shown          |
| `--description` | `-d`     | Show only the ID and description columns |
| `--status`      | `-s`     | Show only the ID and status columns      |

Flags can be combined with any command.

---

## Examples

### Adding tasks

```bash
ttrack add "Buy groceries"
ttrack add "Finish the JavaScript project"
ttrack add "Read documentation for Node.js"
```

### Listing tasks

```bash
# List all tasks
ttrack list

# List only tasks that are todo
ttrack list todo

# List only in-progress tasks
ttrack list in-progress

# List only completed tasks
ttrack list done

# Show only the last 3 tasks
ttrack list --limit 3

# Show only descriptions (no timestamps)
ttrack list --description

# Show only statuses
ttrack list --status

# Combine: show last 5 tasks with just their descriptions
ttrack list -l 5 -d
```

### Updating a task

```bash
# Change the description of task with ID 2
ttrack update 2 "Buy groceries and cook dinner"
```

### Marking task status

```bash
# Start working on task 1
ttrack mark-in-progress 1

# Complete task 1
ttrack mark-done 1

# Reset task 3 back to todo
ttrack mark-todo 3
```

### Deleting a task

```bash
ttrack delete 4
```

### Getting help

```bash
ttrack --help
ttrack -h
```
