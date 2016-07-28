[TestFixture]
public class BudgetRepositoryTest
{
	private TestDbUtils _testDbUtils;
	private Repository _repository;
	private Database _db;

	private Mock<IRepository1> repository1Mock;

	[TestFixtureSetUp]
	public void TestFixtureSetUp()
	{
		_testDbUtils = new TestDbUtils();
	}

	[SetUp]
	public void Setup()
	{
		_db = _testDbUtils.GetDatabase();
		var repository2Mock = new Mock<IRepository2>();
		repository1Mock = new Mock<IRepository1>();
		_repository = new Repository(_db, repository1Mock.Object, repository2Mock.Object);
		_db.BeginTransaction();
		_testDbUtils.InsertInitialData(_db);
	}

	[TearDown]
	public void TearDown()
	{
		_db.Dispose();
	}
	
	[Test]
	public void Should_1()
	{
		_testDbUtils.InsertTestData(_db);		

		var records = _repository.GetData().ToArray();
		records.Should().Not.Be.Null();
		records.Should().Have.Count.EqualTo(3);
	}
}
