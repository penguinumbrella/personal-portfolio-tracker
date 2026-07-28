@RestController
@RequestMapping("/users")
public class UserController {
    
    @GetMapping
    public String getUsers() {
        return "here are our users!";
    }
}
