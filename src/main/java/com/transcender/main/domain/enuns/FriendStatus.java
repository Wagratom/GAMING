package com.transcender.main.domain.enuns;

public enum FriendStatus {
    PENDING,     // Awaiting response from the other user
    ACCEPTED,    // Both users are friends
    DECLINED,    // Friend request was declined
    BLOCKED,      // One user blocked the other
    REMOVED
}
