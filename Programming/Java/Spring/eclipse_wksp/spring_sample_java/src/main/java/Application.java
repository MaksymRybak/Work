import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.pluralsight.service.CustomerService;

public class Application {

	public static void main(String[] args) {

		ApplicationContext appContext = new AnnotationConfigApplicationContext(AppConfig.class);
		
		//CustomerService service = new CustomerServiceImpl();
		
		CustomerService customerService = appContext.getBean("customerService", CustomerService.class);
		System.out.println(customerService);
		
		CustomerService customerService2 = appContext.getBean("customerService", CustomerService.class);
		System.out.println(customerService2);
		
		System.out.println(customerService.findAll().get(0).getFirstName());
		
	}

}
