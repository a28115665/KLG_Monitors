<%@ include file="ExtendMethod.jsp"%>
<%@ page import="org.json.*" %>
<%!
	private String DBTables(String m_parameter){
		if(m_parameter.equals("0")){
			return "UserInfo";
		}
		if(m_parameter.equals("1")){
			return "Monitor";
		}
		if(m_parameter.equals("3")){
			return "Branch";
		}
		if(m_parameter.equals("4")){
			return "Police";
		}
		return "";
	}

	private String QueryMethod(String m_queryname, JSONObject m_requestJSON){
		String SQLCommand = "";
		Iterator it = new ArrayList().iterator();
		if(m_requestJSON != null){
			it = m_requestJSON.keys();
		}
		try {
			//Select Table Condition
			if(m_queryname != null && m_queryname.equals("Select")){
				while(it.hasNext()) {
				    Object key = it.next(); // get key
					SQLCommand += "AND " + key + "='"+m_requestJSON.get(key.toString())+"'";
				}
				return SQLCommand;
			}

			//Select UserInfo Table All Info
			if(m_queryname != null && m_queryname.equals("SelectAllUserInfo")){

				SQLCommand += " SELECT UserInfo.*, Branch.B_Name, Police.P_Name FROM UserInfo LEFT JOIN Branch on Branch.B_ID = UserInfo.U_Branch LEFT JOIN Police on Police.P_ID = UserInfo.U_Police WHERE 1=1 ";

				while(it.hasNext()) {
				    Object key = it.next(); // get key
					//SQLCommand += "AND " + key + "='"+m_requestJSON.get(key.toString())+"'";
				    if(key.toString().equals("U_ID") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND UserInfo.U_ID='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("U_Name") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND UserInfo.U_Name='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("U_PW") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND UserInfo.U_PW='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("U_Role") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND UserInfo.U_Role='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("U_Branch") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND UserInfo.U_Branch='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("U_Police") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND UserInfo.U_Police='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("U_Check") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND UserInfo.U_Check='"+m_requestJSON.get(key.toString())+"'";
					}
				}
				return SQLCommand;
			}

			//Select Monitor Table All Info
			if(m_queryname != null && m_queryname.equals("SelectAllMonitor")){

				SQLCommand += " SELECT * FROM Monitor WHERE 1=1 ";

				while(it.hasNext()) {
				    Object key = it.next(); // get key
				    if(key.toString().equals("M_ID") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_ID='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_Branch") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_Branch='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_Police") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_Police='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_Type") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_Type='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_Addr") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_Addr='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_Direction") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_Direction='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_Malfunction") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_Malfunction='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_Latitude") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_Latitude='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_Longitude") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_Longitude='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_MakerKey") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_MakerKey='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_Remark") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_Remark='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_CR_TIME") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_CR_TIME='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("M_UP_TIME") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND M_UP_TIME='"+m_requestJSON.get(key.toString())+"'";
					}
				}
				return SQLCommand;
			}

			//Select UserInfo Table All Info Without Admin
			if(m_queryname != null && m_queryname.equals("SelectAllUserInfoWithoutAdmin")){

				SQLCommand += " SELECT * FROM UserInfo WHERE U_Branch is not NULL ";

				return SQLCommand;
			}

			//Select Branch Table All Info
			if(m_queryname != null && m_queryname.equals("SelectAllBranch")){

				SQLCommand += " SELECT * FROM Branch WHERE 1=1 ";

				while(it.hasNext()) {
				    Object key = it.next(); // get key
				    if(key.toString().equals("B_ID") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND B_ID='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("B_Name") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND B_Name='"+m_requestJSON.get(key.toString())+"'";
					}
				}
				return SQLCommand;
			}

			//Select Police Table All Info
			if(m_queryname != null && m_queryname.equals("SelectAllPolice")){

				SQLCommand += " SELECT * FROM Police WHERE 1=1 ";

				while(it.hasNext()) {
				    Object key = it.next(); // get key
				    if(key.toString().equals("P_ID") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND P_ID='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("B_ID") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND B_ID='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("P_Name") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND P_Name='"+m_requestJSON.get(key.toString())+"'";
					}
				    if(key.toString().equals("P_Exist") && m_requestJSON.get(key.toString()) != null){
						SQLCommand += "AND P_Exist='"+m_requestJSON.get(key.toString())+"'";
					}
				}
				return SQLCommand;
			}

			
		} catch (JSONException e) {
			//loger.error("組合Select Command失敗["+ whouse +"]，" + e.getMessage());
	     	e.printStackTrace();
	    }
		return SQLCommand;
	}

	private String InsertMethod(String m_insertname, JSONObject m_requestJSON){
		String SQLCommand = "";
		String Schema = "";
		String Values = " VALUES ";
		Iterator it = m_requestJSON.keys();

		try{
			//Insert Table Condition
			if(m_insertname != null && m_insertname.equals("Insert")){
				Schema += " ( ";
				Values += " ( ";
				while(it.hasNext()) {
				    Object key = it.next(); // get key
				    Schema += key.toString() + ",";
				    Values += "N'" + m_requestJSON.get(key.toString()) + "',";
				}
				if(Schema != null && Values != null){
					Schema = TrimEnd(Schema, ",");
					Values = TrimEnd(Values, ",");
				}
				Schema += " ) ";
				Values += " ) ";
				SQLCommand = Schema + Values;

				return SQLCommand;
			}
		} catch (JSONException e) {
			//loger.error("組合Insert Command失敗["+ whouse +"]，" + e.getMessage());
	     	e.printStackTrace();
	    }

		return SQLCommand;
	}

	private String UpdateMethod(String m_updatename, JSONObject m_requestJSON){
		String SQLCommand = "";
		String Set = " SET ";
		Iterator it = m_requestJSON.keys();

		try{
			//Update Table Condition
			if(m_updatename != null && m_updatename.equals("Update")){
				while(it.hasNext()) {
				    Object key = it.next(); // get key
				    Set += key + "=N'" + m_requestJSON.get(key.toString()) + "',";
				}
				if(Set != null){
					Set = TrimEnd(Set, ",");
				}
				SQLCommand = Set;

				return SQLCommand;
			}
		} catch (JSONException e) {
			//loger.error("組合Update Command失敗["+ whouse +"]，" + e.getMessage());
	     	e.printStackTrace();
	    }

		return SQLCommand;
	}
%>