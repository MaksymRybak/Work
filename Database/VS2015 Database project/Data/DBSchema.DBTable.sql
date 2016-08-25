USE [Database];
GO

MERGE INTO DBSchema.DBTable AS dest
USING (
	SELECT *
	FROM (
		VALUES 
		(N'7c6d06d6-be58-4686-851a-ca4366c61b8d', N'type1', N'desc1'),
		(N'48e2cc2c-c3b1-40e3-8337-4d8a1c56e711', N'type2', N'desc2'),
		(N'59a30e28-f911-4534-9fed-40b1b45f4f1a', N'type3', N'desc3'),
		(N'c89393fd-8927-49f4-b294-c9fc82a9b01a', N'type4', N'desc4'),
		(N'92957faa-5579-440a-a6d8-b8e7f644393b', N'type5', N'desc5')
	) v (Id, Type, Description)
) AS src
	ON src.Id = dest.Id
WHEN NOT MATCHED BY SOURCE 
	THEN DELETE
WHEN NOT MATCHED BY TARGET
	THEN INSERT (Id, Type, Description)
	VALUES (Id, Type, Description);
GO
