package com.skillstorm.Util;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.server.ResponseStatusException;

/** Shared lookup/existence-check helpers for service classes, standardizing the 404 behavior across repositories. */
public final class RepoUtils {

    private RepoUtils() {
    }

    /**
     * Fetches an entity by id, or throws a 404 with a standard message if it doesn't exist.
     *
     * @param repo the repository to query
     * @param id the id to look up
     * @param entityName the human-readable entity name to include in the 404 message
     * @return the entity with the given id
     * @throws ResponseStatusException with status 404 if no entity with the given id exists
     */
    public static <T, ID> T findOrThrow(JpaRepository<T, ID> repo, @NonNull ID id, String entityName) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        entityName + " with id " + id + " does not exist in the database."));
    }

    /**
     * Throws a 404 with a standard message if no entity with the given id exists.
     *
     * @param repo the repository to query
     * @param id the id to look up
     * @param entityName the human-readable entity name to include in the 404 message
     * @throws ResponseStatusException with status 404 if no entity with the given id exists
     */
    public static <ID> void requireExists(JpaRepository<?, ID> repo, @NonNull ID id, String entityName) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    entityName + " with id " + id + " does not exist in the database.");
        }
    }
}
