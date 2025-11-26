drop table if exists booking cascade;
drop table if exists restaurant cascade;
drop table if exists restaurant_table cascade;
create table restaurant
(
  id serial primary key,
  name varchar not null
);

create table restaurant_table
(
  id serial primary key,
  in_date DATE,
  begin_at TIME,
  end_at TIME,
  capacity INTEGER,
  is_available BOOLEAN,
  restaurant_id bigint not null,
  constraint fk_booking_restaurant_id foreign key (restaurant_id) references restaurant(id)
)

create table booking
(
  id serial primary key,
  restaurant_id bigint not null,
  restaurant_table_id bigint not null,
  guest_count numeric not null default 0,
  booking_status varchar not null default 'CREATED',
  constraint fk_booking_restaurant_id foreign key (restaurant_id) references restaurant(id),
  constraint fk_booking_restaurant_table_id foreign key (restaurant_table_id) references restaurant_table(id)
);

insert into restaurant (name) VALUES ('Vkusno i tochka');
insert into restaurant (name) VALUES ('Burger hit');
insert into restaurant (name) VALUES ('McDonalds');

insert into restaurant_table (in_date, begin_at, end_at, capacity, is_available, restaurant_id)
VALUES (
  '2025-11-27',
  '10:00',
  '11:00',
  6,
  TRUE,
  (SELECT id FROM restaurant WHERE name = 'Vkusno i tochka')
);
insert into restaurant_table (in_date, begin_at, end_at, capacity, is_available, restaurant_id)
VALUES (
  '2025-11-27',
  '11:00',
  '12:00',
  6,
  TRUE,
  (SELECT id FROM restaurant WHERE name = 'Vkusno i tochka')
);
insert into restaurant_table (in_date, begin_at, end_at, capacity, is_available, restaurant_id)
VALUES (
  '2025-11-27',
  '12:00',
  '13:00',
  6,
  TRUE,
  (SELECT id FROM restaurant WHERE name = 'Vkusno i tochka')
);
insert into restaurant_table (in_date, begin_at, end_at, capacity, is_available, restaurant_id)
VALUES (
  '2025-11-27',
  '13:00',
  '14:00',
  6,
  TRUE,
  (SELECT id FROM restaurant WHERE name = 'Vkusno i tochka')
);

insert into booking
(restaurant_id, guest_count, restaurant_table_id, booking_status)
VALUES
(
  (SELECT id FROM restaurant WHERE name = 'Vkusno i tochka'),
  6,
  (select id FROM restaurant_table WHERE begin_at = '10:00'),
  'CONFIRMED'
);
update restaurant_table set is_available = false
where begin_at = '10:00'::time;

select * from restaurant order by id;
select * from restaurant_table order by id;
select * from booking order by id;