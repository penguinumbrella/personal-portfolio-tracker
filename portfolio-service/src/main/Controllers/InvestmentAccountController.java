@RestController
@RequestMapping("/accounts")
public class InvestmentAccountController {

    @GetMapping
    public String getAccounts(){
        return "wow accounts!";
    }
    
}
