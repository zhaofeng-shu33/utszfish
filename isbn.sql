create table ISBN(
    id int primary key auto_increment,
    isbn varchar(15),
    author varchar(20),
    coverurl varchar(200),
    title varchar(50),
    subtitle varchar(80),
    publisher varchar(50),
    pubdate varchar(20),
    pages varchar(10),
    price varchar(20),
    bookdesc text,
    authordesc text,
    tags varchar(200)
) default charset=utf8mb4;
