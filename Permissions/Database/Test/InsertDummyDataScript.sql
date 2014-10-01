/*
 * Use Permissions DB
 */
 USE permissions_db;
 
/* 
 * Insert Dummy Data 
 */
insert into role (name) values('Test Author');
insert into role (name) values('Test Approver');
insert into role (name) values('Test Kingpin');

insert into permission (name) values('Author Tests');
insert into permission (name) values('Approve Tests');
insert into permission (name) values('Release Tests');

insert into component (name, _fk_pid) values('Test Authoring', 1);
insert into component (name, _fk_pid) values('Test Authoring', 2);
insert into component (name, _fk_pid) values('Test Authoring', 3);
insert into component (name) values('Item Authoring');
insert into component (name) values('Test Delivery');

insert into role_entity values(1, 'CLIENT');
insert into role_entity values(1, 'STATE');
insert into role_entity values(2, 'CLIENT');
insert into role_entity values(2, 'STATE');
insert into role_entity values(3, 'CLIENT');
insert into role_entity values(3, 'STATE');

insert into permission_role (_fk_rid, _fk_cid, _fk_pid) values(1, 1, 1);
insert into permission_role (_fk_rid, _fk_cid, _fk_pid) values(2, 1, 1);
insert into permission_role (_fk_rid, _fk_cid, _fk_pid) values(2, 1, 2);
insert into permission_role (_fk_rid, _fk_cid, _fk_pid) values(3, 1, 1);
insert into permission_role (_fk_rid, _fk_cid, _fk_pid) values(3, 1, 2);
insert into permission_role (_fk_rid, _fk_cid, _fk_pid) values(3, 1, 3);

