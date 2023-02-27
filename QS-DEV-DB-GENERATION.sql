# Create database

DROP DATABASE IF EXISTS QS_DEV_DB;
CREATE DATABASE QS_DEV_DB;

# Create tables in the database

USE QS_DEV_DB;

CREATE TABLE ds(
	PK_DsId int NOT NULL AUTO_INCREMENT,
    InDatabase bool NOT NULL,
    Location varchar(255) NOT NULL,
    DsName varchar(100) NOT NULL ,
    PRIMARY KEY (PK_DsId)
);

CREATE TABLE user(
	PK_CanvasId varchar(10) NOT NULL,
    UserName varchar(100) NOT NULL,
    CreatedAt timestamp NOT NULL DEFAULT (current_timestamp()),
    AcceptedTerms bool NOT NULL DEFAULT false,
    PRIMARY KEY (PK_CanvasId)
);

CREATE TABLE ds_attendance(
	FK_DsId int NOT NULL AUTO_INCREMENT,
    FK_CanvasId varchar(10) NOT NULL,
    DateTime datetime NOT NULL DEFAULT (now()),
    AtLocation bool NOT NULL,
    FOREIGN KEY (FK_DsId) REFERENCES ds(PK_DsId),
    FOREIGN KEY (FK_CanvasId) REFERENCES user(PK_CanvasId)
);

CREATE TABLE used_ds(
	FK_CanvasId varchar(10) NOT NULL UNIQUE,
    FK_DsId int NOT NULL,
    token varchar(100),
    FOREIGN KEY (FK_CanvasId) REFERENCES user(PK_CanvasId),
	FOREIGN KEY (FK_DsId) REFERENCES ds(PK_DsId)
);

CREATE TABLE share(
	FK_CanvasId1 varchar(10) NOT NULL,
    FK_CanvasId2 varchar(10) NOT NULL,
    FK_ShareDs int NOT NULL,
	FOREIGN KEY (FK_CanvasId1) REFERENCES user(PK_CanvasId),
    FOREIGN KEY (FK_CanvasId2) REFERENCES user(PK_CanvasId),
	FOREIGN KEY (FK_ShareDs) REFERENCES ds(PK_DsId),
    PRIMARY KEY(FK_CanvasId1, FK_CanvasId2, FK_ShareDs)
);

# Populate the database
INSERT INTO ds (InDatabase, Location, DsName) VALUES (false, 'https://fhict.instructure.com/api/v1/', 'canvas');
INSERT INTO ds (InDatabase, Location, DsName) VALUES (true, 'ds_attendance', 'attendance');
