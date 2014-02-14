<%@ tag pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ attribute name="name" required="true" rtexprvalue="false" %>
<%@ attribute name="description" required="false" rtexprvalue="false" %>
<div class="process">
    ${name}
    <div class="description hide">
       ${description}
    </div>
</div>
