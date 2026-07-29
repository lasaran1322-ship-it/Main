-- LibraryPro Database Schema
-- SQL Server 2019+

-- Create database
CREATE DATABASE [LibraryProDb];
GO

USE [LibraryProDb];
GO

-- Create Users table (ASP.NET Identity will create these, but here's the schema)
CREATE TABLE [Users] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Email] NVARCHAR(256) NOT NULL UNIQUE,
    [EmailConfirmed] BIT DEFAULT 0,
    [PasswordHash] NVARCHAR(MAX),
    [PhoneNumber] NVARCHAR(50),
    [PhoneNumberConfirmed] BIT DEFAULT 0,
    [FirstName] NVARCHAR(100),
    [LastName] NVARCHAR(100),
    [IsActive] BIT DEFAULT 1,
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    [DeletedAt] DATETIME2 NULL,
    [IsDeleted] BIT DEFAULT 0,
    INDEX [IX_Email] ([Email])
);

-- Create Roles table
CREATE TABLE [Roles] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(100) NOT NULL UNIQUE,
    [Description] NVARCHAR(500),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE()
);

-- Insert default roles
INSERT INTO [Roles] ([Name], [Description])
VALUES 
    (N'Administrator', N'Full system access'),
    (N'Librarian', N'Manage library operations'),
    (N'Member', N'Library member access');

-- Create UserRoles junction table
CREATE TABLE [UserRoles] (
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [RoleId] UNIQUEIDENTIFIER NOT NULL,
    [AssignedAt] DATETIME2 DEFAULT GETUTCDATE(),
    PRIMARY KEY ([UserId], [RoleId]),
    FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]) ON DELETE CASCADE,
    FOREIGN KEY ([RoleId]) REFERENCES [Roles]([Id]) ON DELETE CASCADE
);

-- Create Members table
CREATE TABLE [Members] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [UserId] UNIQUEIDENTIFIER NOT NULL UNIQUE,
    [MembershipNumber] NVARCHAR(50) NOT NULL UNIQUE,
    [JoinDate] DATETIME2 DEFAULT GETUTCDATE(),
    [MembershipExpiryDate] DATETIME2,
    [IsActive] BIT DEFAULT 1,
    [IdentificationNumber] NVARCHAR(50),
    [Address] NVARCHAR(500),
    [City] NVARCHAR(100),
    [State] NVARCHAR(100),
    [PostalCode] NVARCHAR(20),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]) ON DELETE CASCADE,
    INDEX [IX_MembershipNumber] ([MembershipNumber]),
    INDEX [IX_UserId] ([UserId])
);

-- Create Authors table
CREATE TABLE [Authors] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(200) NOT NULL,
    [Biography] NVARCHAR(MAX),
    [DateOfBirth] DATE,
    [Nationality] NVARCHAR(100),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    [DeletedAt] DATETIME2 NULL,
    [IsDeleted] BIT DEFAULT 0,
    INDEX [IX_Name] ([Name])
);

-- Create Publishers table
CREATE TABLE [Publishers] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(200) NOT NULL UNIQUE,
    [ContactEmail] NVARCHAR(256),
    [ContactPhone] NVARCHAR(50),
    [Website] NVARCHAR(500),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    [DeletedAt] DATETIME2 NULL,
    [IsDeleted] BIT DEFAULT 0,
    INDEX [IX_Name] ([Name])
);

-- Create Categories table
CREATE TABLE [Categories] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Name] NVARCHAR(100) NOT NULL UNIQUE,
    [Description] NVARCHAR(500),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    [DeletedAt] DATETIME2 NULL,
    [IsDeleted] BIT DEFAULT 0,
    INDEX [IX_Name] ([Name])
);

-- Create Languages table
CREATE TABLE [Languages] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Code] NVARCHAR(10) NOT NULL UNIQUE,
    [Name] NVARCHAR(100) NOT NULL UNIQUE,
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE()
);

INSERT INTO [Languages] ([Code], [Name])
VALUES 
    (N'en', N'English'),
    (N'es', N'Spanish'),
    (N'fr', N'French'),
    (N'de', N'German'),
    (N'pt', N'Portuguese'),
    (N'hi', N'Hindi'),
    (N'zh', N'Chinese'),
    (N'ar', N'Arabic');

-- Create Books table
CREATE TABLE [Books] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Title] NVARCHAR(300) NOT NULL,
    [Description] NVARCHAR(MAX),
    [ISBN] NVARCHAR(20) NOT NULL UNIQUE,
    [PublisherId] UNIQUEIDENTIFIER,
    [CategoryId] UNIQUEIDENTIFIER,
    [LanguageId] UNIQUEIDENTIFIER,
    [PublicationDate] DATE,
    [Pages] INT,
    [Edition] NVARCHAR(50),
    [TotalCopies] INT DEFAULT 0,
    [AvailableCopies] INT DEFAULT 0,
    [CoverImageUrl] NVARCHAR(500),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    [DeletedAt] DATETIME2 NULL,
    [IsDeleted] BIT DEFAULT 0,
    FOREIGN KEY ([PublisherId]) REFERENCES [Publishers]([Id]),
    FOREIGN KEY ([CategoryId]) REFERENCES [Categories]([Id]),
    FOREIGN KEY ([LanguageId]) REFERENCES [Languages]([Id]),
    INDEX [IX_ISBN] ([ISBN]),
    INDEX [IX_Title] ([Title]),
    INDEX [IX_CategoryId] ([CategoryId])
);

-- Create BookAuthors junction table
CREATE TABLE [BookAuthors] (
    [BookId] UNIQUEIDENTIFIER NOT NULL,
    [AuthorId] UNIQUEIDENTIFIER NOT NULL,
    [AuthorOrder] INT DEFAULT 1,
    PRIMARY KEY ([BookId], [AuthorId]),
    FOREIGN KEY ([BookId]) REFERENCES [Books]([Id]) ON DELETE CASCADE,
    FOREIGN KEY ([AuthorId]) REFERENCES [Authors]([Id]) ON DELETE CASCADE
);

-- Create BookCopies table
CREATE TABLE [BookCopies] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [BookId] UNIQUEIDENTIFIER NOT NULL,
    [Barcode] NVARCHAR(50) NOT NULL UNIQUE,
    [Condition] NVARCHAR(50) DEFAULT N'Good',
    [AcquisitionDate] DATE,
    [AcquisitionCost] DECIMAL(10, 2),
    [Status] NVARCHAR(50) DEFAULT N'Available',
    [Location] NVARCHAR(100),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    FOREIGN KEY ([BookId]) REFERENCES [Books]([Id]) ON DELETE CASCADE,
    INDEX [IX_Barcode] ([Barcode]),
    INDEX [IX_BookId] ([BookId]),
    INDEX [IX_Status] ([Status])
);

-- Create BorrowTransactions table
CREATE TABLE [BorrowTransactions] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [MemberId] UNIQUEIDENTIFIER NOT NULL,
    [BookId] UNIQUEIDENTIFIER NOT NULL,
    [BookCopyId] UNIQUEIDENTIFIER NOT NULL,
    [IssuedDate] DATETIME2 DEFAULT GETUTCDATE(),
    [DueDate] DATETIME2 NOT NULL,
    [ReturnedDate] DATETIME2 NULL,
    [BorrowDays] INT DEFAULT 14,
    [RenewCount] INT DEFAULT 0,
    [MaxRenewals] INT DEFAULT 2,
    [Status] NVARCHAR(50) DEFAULT N'Active',
    [Notes] NVARCHAR(500),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    FOREIGN KEY ([MemberId]) REFERENCES [Members]([Id]),
    FOREIGN KEY ([BookId]) REFERENCES [Books]([Id]),
    FOREIGN KEY ([BookCopyId]) REFERENCES [BookCopies]([Id]),
    INDEX [IX_MemberId] ([MemberId]),
    INDEX [IX_BookId] ([BookId]),
    INDEX [IX_Status] ([Status]),
    INDEX [IX_DueDate] ([DueDate])
);

-- Create Reservations table
CREATE TABLE [Reservations] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [MemberId] UNIQUEIDENTIFIER NOT NULL,
    [BookId] UNIQUEIDENTIFIER NOT NULL,
    [ReservationDate] DATETIME2 DEFAULT GETUTCDATE(),
    [ExpiryDate] DATETIME2 NOT NULL,
    [QueuePosition] INT,
    [Status] NVARCHAR(50) DEFAULT N'Active',
    [Notes] NVARCHAR(500),
    [NotificationSentDate] DATETIME2 NULL,
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    FOREIGN KEY ([MemberId]) REFERENCES [Members]([Id]),
    FOREIGN KEY ([BookId]) REFERENCES [Books]([Id]),
    INDEX [IX_MemberId] ([MemberId]),
    INDEX [IX_BookId] ([BookId]),
    INDEX [IX_Status] ([Status])
);

-- Create Fines table
CREATE TABLE [Fines] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [MemberId] UNIQUEIDENTIFIER NOT NULL,
    [BorrowTransactionId] UNIQUEIDENTIFIER NOT NULL,
    [Amount] DECIMAL(10, 2) NOT NULL,
    [PaidAmount] DECIMAL(10, 2) DEFAULT 0,
    [Type] NVARCHAR(50) DEFAULT N'Overdue',
    [Status] NVARCHAR(50) DEFAULT N'Outstanding',
    [ImposedDate] DATETIME2 DEFAULT GETUTCDATE(),
    [PaidDate] DATETIME2 NULL,
    [Reason] NVARCHAR(500),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2,
    FOREIGN KEY ([MemberId]) REFERENCES [Members]([Id]),
    FOREIGN KEY ([BorrowTransactionId]) REFERENCES [BorrowTransactions]([Id]),
    INDEX [IX_MemberId] ([MemberId]),
    INDEX [IX_Status] ([Status])
);

-- Create Payments table
CREATE TABLE [Payments] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [FineId] UNIQUEIDENTIFIER NOT NULL,
    [Amount] DECIMAL(10, 2) NOT NULL,
    [PaymentDate] DATETIME2 DEFAULT GETUTCDATE(),
    [PaymentMethod] NVARCHAR(50),
    [TransactionReference] NVARCHAR(100),
    [Notes] NVARCHAR(500),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY ([FineId]) REFERENCES [Fines]([Id]) ON DELETE CASCADE,
    INDEX [IX_FineId] ([FineId])
);

-- Create Wishlist table
CREATE TABLE [Wishlists] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [MemberId] UNIQUEIDENTIFIER NOT NULL,
    [BookId] UNIQUEIDENTIFIER NOT NULL,
    [AddedDate] DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY ([MemberId]) REFERENCES [Members]([Id]) ON DELETE CASCADE,
    FOREIGN KEY ([BookId]) REFERENCES [Books]([Id]) ON DELETE CASCADE,
    UNIQUE ([MemberId], [BookId]),
    INDEX [IX_MemberId] ([MemberId]),
    INDEX [IX_BookId] ([BookId])
);

-- Create Notifications table
CREATE TABLE [Notifications] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [Type] NVARCHAR(100) NOT NULL,
    [Title] NVARCHAR(500) NOT NULL,
    [Message] NVARCHAR(MAX),
    [SentDate] DATETIME2 DEFAULT GETUTCDATE(),
    [IsRead] BIT DEFAULT 0,
    [ReadDate] DATETIME2 NULL,
    [Channel] NVARCHAR(100) DEFAULT N'InApp',
    [Reference] NVARCHAR(500),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]) ON DELETE CASCADE,
    INDEX [IX_UserId] ([UserId]),
    INDEX [IX_IsRead] ([IsRead])
);

-- Create AuditLogs table
CREATE TABLE [AuditLogs] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [Action] NVARCHAR(100) NOT NULL,
    [EntityType] NVARCHAR(100) NOT NULL,
    [EntityId] UNIQUEIDENTIFIER NOT NULL,
    [OldValues] NVARCHAR(MAX),
    [NewValues] NVARCHAR(MAX),
    [Description] NVARCHAR(500),
    [Timestamp] DATETIME2 DEFAULT GETUTCDATE(),
    [IpAddress] NVARCHAR(45),
    [UserAgent] NVARCHAR(500),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY ([UserId]) REFERENCES [Users]([Id]),
    INDEX [IX_UserId] ([UserId]),
    INDEX [IX_Timestamp] ([Timestamp]),
    INDEX [IX_EntityType] ([EntityType])
);

-- Create indexes for performance
CREATE INDEX [IX_Books_PublisherId] ON [Books]([PublisherId]);
CREATE INDEX [IX_BorrowTransactions_MemberId] ON [BorrowTransactions]([MemberId]);
CREATE INDEX [IX_BorrowTransactions_BookCopyId] ON [BorrowTransactions]([BookCopyId]);
CREATE INDEX [IX_Fines_MemberId] ON [Fines]([MemberId]);

GO

-- Create views for common queries

-- View: OverdueBooks
CREATE VIEW [vw_OverdueBooks] AS
SELECT 
    BT.Id,
    M.Id AS MemberId,
    U.Email,
    U.FirstName,
    U.LastName,
    B.Title,
    BT.DueDate,
    DATEDIFF(DAY, BT.DueDate, GETUTCDATE()) AS OverdueDays,
    BC.Barcode
FROM [BorrowTransactions] BT
INNER JOIN [Members] M ON BT.MemberId = M.Id
INNER JOIN [Users] U ON M.UserId = U.Id
INNER JOIN [Books] B ON BT.BookId = B.Id
INNER JOIN [BookCopies] BC ON BT.BookCopyId = BC.Id
WHERE BT.Status = 'Active' AND BT.DueDate < GETUTCDATE();

GO

-- View: MemberBorrowingSummary
CREATE VIEW [vw_MemberBorrowingSummary] AS
SELECT 
    M.Id,
    M.MembershipNumber,
    U.FirstName + ' ' + U.LastName AS MemberName,
    COUNT(CASE WHEN BT.Status = 'Active' THEN 1 END) AS ActiveLoans,
    COUNT(CASE WHEN BT.Status = 'Active' AND BT.DueDate < GETUTCDATE() THEN 1 END) AS OverdueBooks,
    SUM(CASE WHEN F.Status = 'Outstanding' THEN F.Amount - F.PaidAmount ELSE 0 END) AS OutstandingFines
FROM [Members] M
INNER JOIN [Users] U ON M.UserId = U.Id
LEFT JOIN [BorrowTransactions] BT ON M.Id = BT.MemberId
LEFT JOIN [Fines] F ON M.Id = F.MemberId
GROUP BY M.Id, M.MembershipNumber, U.FirstName, U.LastName;

GO
