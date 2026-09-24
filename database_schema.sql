drop table if exists accounts cascade;
drop table if exists profiles cascade;
drop table if exists posts cascade;
drop table if exists comments cascade;
drop table if exists post_likes cascade;
drop table if exists comment_likes cascade;

create table accounts (
  account_id text primary key,
  account_name text not null,
  password_hash text not null,
  deleted_at timestamp,
  created_at timestamp default now()
);

create table profiles (
  profile_id text primary key,
  account_id text not null references accounts(account_id) on delete cascade,
  profile_name text not null,
  bio text not null default '',
  deleted_at timestamp,
  created_at timestamp default now()
);

create index on profiles (account_id);

create table posts (
  post_id serial primary key,
  profile_id text not null references profiles(profile_id),
  subject text not null,
  content text not null default '',
  deleted_at timestamp,
  created_at timestamp default now()
);

create index on posts (profile_id);

create table comments (
  comment_id serial primary key,
  post_id integer not null references posts(post_id),
  profile_id text not null references profiles(profile_id),
  content text not null,
  deleted_at timestamp,
  created_at timestamp default now()
);

create index on comments (post_id);

create table post_likes (
  profile_id text not null references profiles(profile_id),
  post_id integer not null references posts(post_id),
  primary key (profile_id, post_id)
);

create table comment_likes (
  profile_id text not null references profiles(profile_id),
  comment_id integer not null references comments(comment_id),
  primary key (profile_id, comment_id)
);
