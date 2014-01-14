---
layout: post
title: "Role does not exist"
date: 2013-12-20 10:49
comments: true
categories: 
---
You've launched into your new rails side-project using postgresql and you've hit a wall setting up your database. When you run `rake db:create` you get the following error message:

**FATAL: role "the_name_of_your_app" does not exist**


Your first alarm bell should be the fact that it's using the name of your rails project. What it actually means is that the *user* 'the_name_of_your_app' is not there.

Run `psql` on the command line and then execute the command `\du` (when you're done use `\q` to exit). Your output should look something like this:
``` bash
                                List of roles
   Role name   |                   Attributes                   | Member of 
---------------+------------------------------------------------+-----------
  nathanallen  | Superuser, Create role, Create DB, Replication | {}

```
Note that "the_name_of_your_app" isn't listed under role name. Nor should it be: by default when postgres is first installed it uses your local system username.

But we don't need to do anything fancy!

Solution: pull up your `config/database.yml` file and note the (default) username and password fields:

```
development:
  adapter: postgresql
  encoding: unicode
  database: the_name_of_your_app_development
  pool: 5
  username: the_name_of_your_app
  password:
```

Delete all occurrences of username and password (or set them appropriately).