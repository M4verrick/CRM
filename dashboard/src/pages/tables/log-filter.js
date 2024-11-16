const filterCloudWatchLogs = (logs, agentId = null) => {
  try {
    // Filter for valid JSON messages and parse them
    const jsonLogs = logs
      .filter(log => {
        try {
          // Check if the log entry contains valid JSON
          const jsonStart = log.indexOf('{');
          const jsonEnd = log.lastIndexOf('}');
          if (jsonStart === -1 || jsonEnd === -1) return false;
          
          const jsonPart = log.substring(jsonStart, jsonEnd + 1);
          JSON.parse(jsonPart);
          return true;
        } catch (e) {
          return false;
        }
      })
      .map(log => {
        // Extract and parse the JSON part of the log
        const jsonStart = log.indexOf('{');
        const jsonEnd = log.lastIndexOf('}');
        const jsonPart = log.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonPart);
      });

    // Filter by agent_id if provided
    const filteredLogs = agentId 
      ? jsonLogs.filter(log => log.agent_id === agentId)
      : jsonLogs;

    // Sort by timestamp in descending order
    return filteredLogs.sort((a, b) => 
      new Date(b['@timestamp']) - new Date(a['@timestamp'])
    );
  } catch (error) {
    console.error('Error processing logs:', error);
    return [];
  }
};

// Example usage:
const sampleLogs = [
  `Hibernate: select ap1_0.id from agent_profile...`,
  `{"@timestamp":"2024-11-10T13:40:06.01617822Z","logger_name":"com.itsag3t1.crm.service.ProfileService","level":"INFO","message":"e99ae5fc-f011-7022-5aaf-02f089493c69 retrieved all profiles at 2024-11-10T13:40:06.016Z","agent_id":"e99ae5fc-f011-7022-5aaf-02f089493c69","date_time":"2024-11-10T13:40:06.016Z"}`,
  `Hibernate: select p1_0.id from profiles...`,
  `{"@timestamp":"2024-11-10T13:41:06.01617822Z","logger_name":"com.itsag3t1.crm.service.ProfileService","level":"INFO","message":"different-agent-id retrieved all profiles at 2024-11-10T13:41:06.016Z","agent_id":"different-agent-id","date_time":"2024-11-10T13:41:06.016Z"}`
];

// Filter all JSON logs
const allJsonLogs = filterCloudWatchLogs(sampleLogs);
console.log('All JSON logs:', allJsonLogs);

// Filter logs for specific agent
const specificAgentLogs = filterCloudWatchLogs(sampleLogs, 'e99ae5fc-f011-7022-5aaf-02f089493c69');
console.log('Specific agent logs:', specificAgentLogs);
