SELECT cs.id, cs.title, 
  COUNT(cm.id) as total_msgs, 
  COUNT(cm."audioUrl") as audio_msgs
FROM "ChatSession" cs 
LEFT JOIN "ChatMessage" cm ON cm."sessionId" = cs.id 
WHERE cs.type IN ('script','chat|script') 
GROUP BY cs.id, cs.title 
ORDER BY cs."updatedAt" DESC LIMIT 5;
