using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using ADOUtils;
using BUM.Infrastructure.AuthProvider;
using Moq;
using NUnit.Framework;
using SharpTestsEx;

namespace BUM.Tests.Controllers
{
    [TestFixture]
    public class ControllerTest
    {
        private IDisposable _server;
        private IDatabase _db;

        private TestDbUtils _testDbUtils;

        [TestFixtureSetUp]
        public void TestFixtureSetUp()
        {
            _testDbUtils = new TestDbUtils();
        }

        [SetUp]
        public void SetUp()
        {
            _db = _testDbUtils.GetDatabase();
            _db.BeginTransaction();
            _testDbUtils.InsertInitialData(_db);           

            _server = TestAppUtils.StartWebServer(_db);
        }

        [TearDown]
        public void TearDown()
        {
            _db.Dispose();
            _server.Dispose();
        }

        [Test]
        public void Should_return_get_response()
        {
            var apiUrl = $"apiUrl";
            var response = new HttpClient().GetAsync(apiUrl).Result;

            response.Should().Not.Be.Null();
            response.StatusCode.Should().Be.EqualTo(HttpStatusCode.OK);

            var json = response.Content.ReadAsStringAsync().Result;
            var data = JsonHelper.Deserialize(json) as List<object>;
            data.Should().Have.Count.EqualTo(3);

            var areaToAssert = data[0] as Dictionary<string, object>;
            areaToAssert.Keys.Should().Contain("prop1");
            areaToAssert.Keys.Should().Contain("prop2");
        }
		
		[Test]
        public void Should_get_response_mock_example()
        {            
            _repository.Setup(r => r.GetData(It.IsAny<Object>())).Returns(testData);
            
            var target = new Controller(_repository.Object);
            var response = target.GetData();

            response.Should().Not.Be.Null();
            _repository.Verify(r => r.GetData(It.IsAny<Object>()), Times.Once());
        }
		
		[TestCase("1")]
        [TestCase("2")]
        public void Should_get_data_to_client_more_cases(string testCase)
        {           
            var apiUrl = $"apiUrl";
            var response = new HttpClient().GetAsync(apiUrl).Result;

            response.Should().Not.Be.Null();
            response.StatusCode.Should().Be.EqualTo(HttpStatusCode.OK);

            var json = JToken.Parse(response.Content.ReadAsStringAsync().Result);
            JToken.DeepEquals(json, JToken.Parse(@"[{
                prop1: 1000,
                prop2: 'test 1',
                prop3: 5000.0,               
                prop4: 'da288871-7d3c-4d83-9605-0366af537e14',               
                prop5: 0                
              }
            ]")).Should().Be.True();
        }
		
		[Test]
        public void Should_return_bad_request_when_post_wrong_data()
        {
            var json = JToken.Parse(@"{               
                prop: 'prop value'                
            }").ToString();

            var apiUrl = $"apiUrl/insertcmd";
            var response = new HttpClient().PostAsync(apiUrl, new StringContent(json, Encoding.UTF8, "application/json")).Result;

            response.Should().Not.Be.Null();
            response.StatusCode.Should().Be.EqualTo(HttpStatusCode.BadRequest);
        }
		
		[Test]
		public void Should_update_data()
        {
            _testDbUtils.InsertBudget(_db, testData);

            var json = JToken.Parse(@"{
                Id: 1000,                
                Desc: 'test',                
                IdSupplier: '01e796d1-032a-48ce-832e-6e2b5e362f03'
            }").ToString();

            var apiUrl = $"apiUrl/updatecmd";
            var response = new HttpClient().PutAsync(apiUrl, new StringContent(json, Encoding.UTF8, "application/json")).Result;

            response.Should().Not.Be.Null();
            response.StatusCode.Should().Be.EqualTo(HttpStatusCode.OK);

            var record = _db.Query("select * from table").AsDisconnected().Single();
            record.Get<int>("Id").Should().Be.EqualTo(1000);
            record.Get<string>("Desc").Should().Be.EqualTo("test");
            record.Get<Guid>("IdSupplier").Should().Be.EqualTo("01e796d1-032a-48ce-832e-6e2b5e362f03");
        }
    }
}
