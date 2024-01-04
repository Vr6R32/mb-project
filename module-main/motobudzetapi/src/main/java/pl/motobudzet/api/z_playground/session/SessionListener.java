package pl.motobudzet.api.z_playground.session;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class SessionListener implements HttpSessionListener {

    private static final ConcurrentHashMap<String, HttpSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        HttpSession session = se.getSession();
        sessions.put(session.getId(), session);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        sessions.remove(se.getSession().getId());
    }

    public static ConcurrentHashMap<String, HttpSession> getActiveSessions() {
        return sessions;
    }

    public Map<String, Object> getSessionDetails(String sessionId) {
        HttpSession session = sessions.get(sessionId);

        System.out.println(session.getCreationTime());
        System.out.println(session.getLastAccessedTime());

        if (session == null) {
            return Collections.emptyMap(); // lub wyjątek, jeśli sesja nie istnieje
        }

        Map<String, Object> details = new HashMap<>();
        details.put("ID", session.getId());
        details.put("CreationTime", session.getCreationTime());
        details.put("LastAccessedTime", session.getLastAccessedTime());
        details.put("MaxInactiveInterval", session.getMaxInactiveInterval());
        details.put("isNew", session.isNew());

        return details;
    }

}