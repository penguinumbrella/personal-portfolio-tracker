@RestController
@RequestMapping("/cache")
public class FallbackController {

    @GetMapping("/users")
    public String cachedUsers() {
        return "CircuitBreaker popped. Users from cache.";
    }

    @GetMapping("/accounts")
    public String cachedAccounts() {
        return "CircuitBreaker popped. Accounts from cache.";
    }
    
}
