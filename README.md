This is a [Next.js] e-commerce application(https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First to install the necessary dependencies, run the command:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev

```

Lastly, make sure to REPLACE the values in your environment variables where necessary. Do not use mine. Also replace the Bearer key/API keys in the app/api/payment route and app/api/verifyPayment routes.

## DO NOT USE MY ENVIRONMENT VARIABLES. REPLACE WITH YOURS

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project is from Eldics Pro and it's intended to educate you.

sql queries used:

for Reviews Table:

--\*\*\*-- --create table for reviews
create table reviews (

id uuid primary key default gen_random_uuid(),
--should be made unique so one review for a particular order,
order_id uuid references orders(id) on delete cascade not null unique,
user_id uuid references auth.users(id) on delete cascade not null,
review_images text[], -- Store array of image URLs
review_title text,
review_description text,
product_rating numeric default 5,
delivery_rating numeric default 5,
product_image_url text,
product_name text,
amount_paid numeric,
the_quantity int,
created_at timestamp default now(),
updated_at timestamp default now()
);

--\*\*\*-- Set up Row Level Security (RLS) for reviews table
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table reviews enable row level security;

create policy "Readable by User." on reviews for
select
using (
(
select
auth.uid ()
) = user_id
);

create policy "Users can insert their own data." on reviews for insert
with
check (
(
select
auth.uid ()
) = user_id
);

create policy "Users can update own data." on reviews
for update
using (
(
select
auth.uid ()
) = user_id
);

create policy "Users can delete own data." on reviews
for delete
using (
(
select
auth.uid ()
) = user_id
);

---\*\*\*-- --for review_bucket
-- Set up Storage!-----
insert into
storage.buckets (id, name)
values
('review_bucket', 'review_bucket');

---\*\*\*-- - Set up access controls for review storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "review images are publicly accessible." on storage.objects for
select
using (bucket_id = 'review_bucket');

create policy "Anyone can upload a review image." on storage.objects for insert
with
check (bucket_id = 'review_bucket');

for Address:
-- SQL Function
create or replace function enforce_single_default_address()
returns trigger as $$
begin
-- Set is_default = false for all other addresses of the same user
update address
set is_default = false
where user_id = NEW.user_id and id <> NEW.id;

return NEW;
end;

$$
language plpgsql;

-- Trigger
create trigger on_default_address_set
after update on address
for each row
when (NEW.is_default = true)
execute function enforce_single_default_address();


for Orders:
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid not null,
    user_email text ,
    product_name TEXT NOT NULL,
    product_category TEXT,
    amount_paid NUMERIC(10, 2) NOT NULL,
    reference_paystack text Not null,
    quantity_bought INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'cancelled', 'shipped', 'delivered', 'returned', 'waiting', 'reviewed')),
    size TEXT,
    color TEXT ,
    region Text,
    state text,
    city text,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    country_code text,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),


    -- Foreign key constraints
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

--***--  Set up Row Level Security (RLS) for reviews table
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table orders enable row level security;

create policy "Readable by User." on orders for
select
  using (
    (
      select
        auth.uid ()
    ) = user_id
  );

create policy "Users can insert their own data." on orders for insert
with
  check (
    (
      select
        auth.uid ()
    ) = user_id
  );

create policy "Users can update own data." on orders
for update
  using (
    (
      select
        auth.uid ()
    ) = user_id
  );


create policy "Users can delete own data." on orders
for delete
  using (
    (
      select
        auth.uid ()
    ) = user_id
  );

for Address:

CREATE TABLE address (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid not null,
    title Text,
    region TEXT DEFAULT 'Nigeria',
    address Text,
    state text,
    city text,
    phone Text,
    country_code TEXT,
    flag Text,
    is_default boolean default false,
    created_at timestamp default now(), --current_timestamp
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
--***--  Set up Row Level Security (RLS) for reviews table
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.


alter table address enable row level security;

create policy "Readable by User." on address for
select
  using (
    (
      select
        auth.uid ()
    ) = user_id
  );

create policy "Users can insert their own data." on address for insert
with
  check (
    (
      select
        auth.uid ()
    ) = user_id
  );

create policy "Users can update own data." on address
for update
  using (
    (
      select
        auth.uid ()
    ) = user_id)


for Categories:
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

alter table categories enable row level security;

create policy "Readable by everyone." on categories for
select
  using (true);

for Products:


---**- Create the products table. should have the product author later
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) on delete cascade not null,
    sizes text[] ,
    colors text[] ,
    styles text[],
    brand Text,
    image_url_array TEXT[] NOT NULL,
    video_url_array TEXT[] DEFAULT ARRAY[]::TEXT[],
    name TEXT NOT NULL,
    category uuid NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    discount NUMERIC(5, 2) DEFAULT 0,
    quantity INTEGER NOT NULL,
    product_shipping_fee integer,
    offer_price numeric(10, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    location text,
    product_comment text,
    --foreign key constraint
    CONSTRAINT fk_category FOREIGN KEY (category) REFERENCES categories(id)

);

alter table products enable row level security;

create policy "Readable by everyone." on products for
select
  using (true);


for eldics_users table and storage:

---***-- - Create a table eldics_users
create table eldics_users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text ,
  username text,
  email text unique,
  created_at timestamp default now(), --current_timestamp,
  updated_at timestamp with time zone,

  constraint username_length check (char_length(username) >= 3)
);

--***-- Set up Row Level Security (RLS) for eldics_users table
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table eldics_users enable row level security;

create policy "Readable by everyone." on eldics_users for
select
  using (true);

create policy "Users can insert their own data." on eldics_users for insert
with
  check (
    (
      select
        auth.uid ()
    ) = id
  );
create policy "Users can update own data." on eldics_users
for update
  using (
    (
      select
        auth.uid ()
    ) = id
  );



--***-- This function is to automatically update the email address on on auth Users table when email on eldics_users table updates.
create function public.updating_auth_user_email()
returns trigger
set search_path = 'public'
as
$$

begin
-- Update the email in auth.users
update auth.users
set email = new.email
where id = new.id;

return new;
end;

$$
language plpgsql security definer;

--***-- this is for after update of the email field on eldics_users
create trigger on_eldics_users_email_update
after update on public.eldics_users
for each row
when (old.email is distinct from new.email)
execute function public.updating_auth_user_email();


--***-- This trigger automatically creates an entry on eldics_users table when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handling_new_user () returns trigger
set
  search_path = '' as
$$

begin
if new.raw_user_meta_data->>'avatar_url' is null or new.raw_user_meta_data->>'avatar_url' = '' then
new.raw_user_meta_data = jsonb_set(new.raw_user_meta_data, '{avatar_url}', '"https://thfywnuxkivlmokxzbyp.supabase.co/storage/v1/object/public/temp1//user.png"' ::jsonb);
end if;
insert into public.eldics_users (id, email, avatar_url)
values (new.id, new.email, new.raw_user_meta_data->>'avatar_url' );
return new;
end;

$$
language plpgsql security definer;

--***-- This trigger is to call the handle_new_user func when Users email is confirmed
create or replace trigger on_the_auth_user_verified
after update on auth.users
for each row
when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
execute procedure public.handling_new_user();




                                          --***-- FOR STORAGE --***--
--***-- for avatars bucket---
-- Set up Storage!
insert into
  storage.buckets (id, name)
values
  ('avatars', 'avatars');

--***-- Set up access controls for avatar storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects for
select
  using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects for insert
with
  check (bucket_id = 'avatars');




$$
