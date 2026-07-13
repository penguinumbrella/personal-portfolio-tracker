package com.skillstorm.Util;

import org.springframework.data.repository.CrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public final class RepoUtils {

    private RepoUtils() {
    }

    /** Fetches an entity by id, or throws a 404 with a standard message if it doesn't exist. */
    public static <T, ID> T findOrThrow(CrudRepository<T, ID> repo, ID id, String entityName) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        entityName + " with id " + id + " does not exist in the database."));
    }

    /** Throws a 404 with a standard message if no entity with the given id exists. */
    public static <ID> void requireExists(CrudRepository<?, ID> repo, ID id, String entityName) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    entityName + " with id " + id + " does not exist in the database.");
        }
    }
}
