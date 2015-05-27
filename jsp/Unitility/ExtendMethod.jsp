<%!
	public static String TrimEnd(String input, String charsToTrim)
	{
		return input.replaceAll("[" + charsToTrim + "]+$", "");		
	}	
	
	public static String TrimStart(String input, String charsToTrim)
	{
		return input.replaceAll("^[" + charsToTrim + "]+", "");	
	}

	public static String Trim(String input, String charsToTrim)
	{
		return input.replaceAll("^[" + charsToTrim + "]+|[" + charsToTrim + "]+$", "");	
	}

%>