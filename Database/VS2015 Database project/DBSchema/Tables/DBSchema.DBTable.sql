CREATE TABLE [DBSchema].[DBTable] (
    [Id]          UNIQUEIDENTIFIER DEFAULT (newsequentialid()) ROWGUIDCOL NOT NULL,
    [Type]        VARCHAR (20)     NOT NULL,
    [Description] VARCHAR (100)    NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [UQ_DBSchema_DBTable_Type] UNIQUE NONCLUSTERED ([Type] ASC)
);

