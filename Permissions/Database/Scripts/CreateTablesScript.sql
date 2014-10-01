/*
 * use permissions db
 */
 use permissions_db;
 
/*
 * drop tables if they exist 
 * for every table 'a' that has a constraint on table 'b', table a must be dropped before table b. 
 */
drop table if exists `permission_role`;
drop table if exists `role_entity`;
drop table if exists `component`;
drop table if exists `permission`;
drop table if exists `role`;
drop table if exists `entitytype`;

/*
 * create tables 
 */
create table `role` (
	`_id` INT AUTO_INCREMENT,
	`name` varchar(50) not null,
    primary key (`_id`)
);

create table  `entitytype` (
        `_id` INT AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
        `unique_key` VARCHAR(50) NOT NULL,
        PRIMARY KEY (`_id`),
        UNIQUE (`unique_key`)
);

create table `role_entity` (
        `_fk_rid` INT NOT NULL,
        `_fk_etuk` VARCHAR(50) NOT NULL,
        CONSTRAINT `roleentity_fk_rid` FOREIGN KEY (`_fk_rid`) REFERENCES `role` (`_id`) ON DELETE CASCADE,
        CONSTRAINT `roleentity_fk_etuk` FOREIGN KEY (`_fk_etuk`) REFERENCES `entitytype` (`unique_key`) ON DELETE CASCADE
);

create table  `permission` (
	`_id` int auto_increment,
	`name` varchar(50) not null,
	primary key (`_id`)
);

create table  `component` (
        `_id` INT AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
		`_fk_pid` INT,
		PRIMARY KEY (`_id`),
		constraint `component_fk_pid` foreign key (`_fk_pid`) references `permission` (`_id`) on delete cascade
);

create table `permission_role` (
	`_id` int AUTO_INCREMENT,
	`_fk_rid` INT,
	`_fk_cid` INT NOT NULL,
	`_fk_pid` INT NOT NULL,
	primary key (`_id`),
	constraint `permissionrole_fk_rid` foreign key (`_fk_rid`) references `role` (`_id`) on delete cascade,
	constraint `permissionrole_fk_pid` foreign key (`_fk_pid`) references `permission` (`_id`) on delete cascade,
	constraint `permissionrole_fk_cid` foreign key (`_fk_cid`) references `component` (`_id`) on delete cascade
);