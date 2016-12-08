-- Taken from http://wiki.postgresql.org/wiki/Pseudo_encrypt
CREATE OR REPLACE FUNCTION pseudo_encrypt(VALUE int) returns bigint AS $$
DECLARE
l1 int;
l2 int;
r1 int;
r2 int;
i int:=0;
BEGIN
 l1:= (VALUE >> 16) & 65535;
 r1:= VALUE & 65535;
 WHILE i < 3 LOOP
   l2 := r1;
   r2 := l1 # ((((1366.0 * r1 + 150889) % 714025) / 714025.0) * 32767)::int;
   l1 := l2;
   r1 := r2;
   i := i + 1;
 END LOOP;
 RETURN ((l1::bigint << 16) + r1);
END;
$$ LANGUAGE plpgsql strict immutable;

-- Create a sequence for generating the input to the pseudo_encrypt function
CREATE OR REPLACE SEQUENCE random_int_seq;

-- A function that increments the sequence above and generates a random integer
CREATE OR REPLACE FUNCTION make_random_id() returns bigint AS $$
  select pseudo_encrypt(nextval('random_int_seq')::int)
$$ language sql;