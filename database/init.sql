create table restaurant
(
  id serial primary key,
  name varchar not null
);

create table booking
(
  id serial primary key,
  restaurant_id bigint not null,
  guest_count numeric not null default 0,
  booking_date date not null default current_date,
  constraint fk_booking_restaurant_id foreign key (restaurant_id) references restaurant(id)
);

insert into restaurant (name) VALUES ('Vkusno i tochka');
insert into restaurant (name) VALUES ('Burger hit');
insert into restaurant (name) VALUES ('McDonalds');

insert into booking
(restaurant_id, guest_count, booking_date)
VALUES
(1, 2, '2025-11-26');
insert into booking
(restaurant_id, guest_count, booking_date)
VALUES
(2, 3, '2025-11-27');
insert into booking
(restaurant_id, guest_count, booking_date)
VALUES
(3, 4, '2025-11-28');

select * from restaurant;
select * from booking;