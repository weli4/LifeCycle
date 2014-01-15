<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>
<script type="text/javascript" src="<c:url value="/resources/js/alt_choose.js"/>" > </script>
Choose alternativse!
<br/>
<form >
<input type="button" id="add_button" value="+"/>
<input type="button" id="sub_button" value="-"/>
<input type="submit" formmethod="POST" id="submit_button" value="test_submit" />
<div id="alt_div">
    <ol id="alt_ordered_list">
        <li>
            <input type="text" name="input_alt"/>
        </li>
        <li>
            <input type="text" name="input_alt"/>
        </li>
    </ol>
</div>
</form>






<%@ include file="/WEB-INF/jsp/footer.jsp" %>