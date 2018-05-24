
const SQLQUERY_DS_App_CategoryComboId = "SELECT distinct (dataelement.dataelementid),dataelement.name, categories_categoryoptions.categoryoptionid, dataelementcategoryoption.name  \
from dataelement  \
INNER JOIN categorycombos_categories ON categorycombos_categories.categorycomboid = dataelement.categorycomboid  \
INNER JOIN categories_categoryoptions ON categories_categoryoptions.categoryid = categorycombos_categories.categoryid  \
INNER JOIN dataelementcategoryoption ON dataelementcategoryoption.categoryoptionid = categories_categoryoptions.categoryoptionid  \
INNER JOIN datasetelement  ON  datasetelement.dataelementid = dataelement.dataelementid where dataelement.dataelementid in  \
( select datasetelement.dataelementid from datasetelement where datasetelement.datasetid = '${datasetelementid}' )  \
order by dataelement.dataelementid";

const SQLQUERY_DS_App_CategoryComboId_NAME = "DS_App Get_Category_Combo_Id";

const SQLQUERY_DS_App_Data_Status = "SELECT  P .periodid, P .startdate ,dv.sourceid, ou.uid, COUNT (VALUE) entered FROM datavalue dv  \
INNER JOIN datasetelement  dsm ON dv.dataelementid = dsm.dataelementid  \
INNER JOIN dataset ds ON ds.datasetid = dsm.datasetid INNER JOIN organisationunit ou ON dv.sourceid = ou.organisationunitid  \
 INNER JOIN period P ON dv.periodid = P .periodid WHERE ou.uid IN(Select  uid FROM organisationunit  where parentid IN ( Select  organisationunitid FROM organisationunit  where parentid IN	(Select organisationunitid FROM organisationunit  where parentid IN  \
	( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgUnitUids}' or parentid='${orgUnitUids}') ) or organisationunitid In  \
	( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgUnitUids}' or parentid='${orgUnitUids}'))or organisationunitid In  \
	( Select  organisationunitid FROM organisationunit  where parentid IN (Select organisationunitid FROM organisationunit  where parentid IN  \
	( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgUnitUids}' or parentid='${orgUnitUids}')) or organisationunitid In  \
	( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgUnitUids}' or parentid='${orgUnitUids}')) ) and ds.uid = '${dataSetUid}' AND dv.periodid IN  \
 ( SELECT periodid FROM period WHERE periodtypeid IN ( SELECT periodtypeid from dataset where uid= '${dataSetUid}' )  \
  AND startdate >= '${startDate}' AND enddate <= '${endDate}') GROUP BY ou.uid, P .periodid, P .startdate ,dv.sourceid, ou.uid ORDER BY ou.uid ASC";

const SQLQUERY_DS_App_Data_Status_NAME = "DS_App_Data_Status";

const SQLQUERY_DS_App_Data_Summary = "SELECT  P .periodid, P .startdate,dv.sourceid, ou.uid , COUNT (VALUE) entered, (COUNT(VALUE) * 100) / 232  \
comp FROM datavalue dv  \
INNER JOIN datasetelement dsm ON dv.dataelementid = dsm.dataelementid  \
INNER JOIN organisationunit ou ON dv.sourceid = ou.organisationunitid  \
INNER JOIN period P ON dv.periodid = P .periodid  \
INNER JOIN dataset ds ON dsm.datasetid = ds.datasetid  \
WHERE dv.periodid IN ( SELECT periodid FROM period WHERE periodtypeid IN \
  ( SELECT periodtypeid FROM dataset WHERE uid = '${dataSetUid}' ) AND startdate >= '${startDate}' AND enddate <= '${endDate}' ) \
   AND ds.uid = '${dataSetUid}' AND  ou.uid IN(Select  uid FROM organisationunit  where parentid IN ( Select  organisationunitid FROM organisationunit  where parentid IN (Select organisationunitid FROM organisationunit  where parentid IN  \
	( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgUnitUids}' or parentid='${orgUnitUids}') ) or organisationunitid In \
	( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgUnitUids}' or parentid='${orgUnitUids}'))or organisationunitid In \
	( Select  organisationunitid FROM organisationunit  where parentid IN (Select organisationunitid FROM organisationunit  where parentid IN \
	( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgUnitUids}' or parentid='${orgUnitUids}')) or organisationunitid In \
	( SELECT organisationunitid FROM organisationunit where organisationunitid='${orgUnitUids}' or parentid='${orgUnitUids}')) )   GROUP BY ou.uid, P .periodid, P .startdate ,dv.sourceid, ou.uid ORDER BY ou.uid ASC";

const SQLQUERY_DS_App_Data_Summary_NAME = "DS_App_Data_Summary";

const SQLQUERY_DS_App_Periods = "select startdate from period  \
where startdate >= '${startDate}' and startdate <='${endDate}' and periodtypeid in ( select periodtypeid from dataset where uid = '${dataSetUidForLevel}' ) \
order by startdate ASC";

const SQLQUERY_DS_App_Periods_NAME = "DS_App_Periods";

const SQLQUERY_DS_App_User_Details = "SELECT ou.uid,p.startdate, dv.storedby, max(dv.lastupdated) FROM datavalue  \
dv INNER JOIN datasetelement dsm ON dv.dataelementid = dsm.dataelementid  \
INNER JOIN dataset ds ON ds.datasetid = dsm.datasetid  \
INNER JOIN organisationunit ou ON dv.sourceid = ou.organisationunitid  \
INNER JOIN period P ON dv.periodid = P .periodid WHERE ds.uid = '${dataSetUid}' AND dv.periodid IN ( SELECT periodid FROM period WHERE periodtypeid  \
IN ( SELECT periodtypeid from dataset where uid= '${dataSetUid}' ) )  \
GROUP BY ou.uid, P .periodid, P .startdate, dv.storedby ORDER BY ou.uid ASC";

const SQLQUERY_DS_App_User_Details_NAME = "DS_App_User_Details";

const SQLQUERY_DS_App_GetDataSetId = "select datasetid from dataset where uid = '${dataSetID}'";

const SQLQUERY_DS_App_GetDataSetId_NAME = "DS_App_Get_DataSet_Id";

const SQLQUERY_DS_App_GetOrgUnitId = "SELECT organisationunitid, uid, name, parentid, hierarchylevel  FROM organisationunit where uid='${orgUnitId}';";

const SQLQUERY_DS_App_GetOrgUnitId_NAME = "DS_App_Get_Organisation Id";

const SQLView_Init = [
    {
        name : SQLQUERY_DS_App_CategoryComboId_NAME,
        query :SQLQUERY_DS_App_CategoryComboId,
        desc : "",
        type : "QUERY"
    },
    {
        name : SQLQUERY_DS_App_Data_Status_NAME,
        query :SQLQUERY_DS_App_Data_Status,
        desc : "",
        type : "QUERY"
    },
    {
        name : SQLQUERY_DS_App_Data_Summary_NAME,
        query :SQLQUERY_DS_App_Data_Summary,
        desc : "",
        type : "QUERY"
    },
    {
        name : SQLQUERY_DS_App_Periods_NAME,
        query :SQLQUERY_DS_App_Periods,
        desc : "",
        type : "QUERY"
    },
    {
        name : SQLQUERY_DS_App_User_Details_NAME,
        query :SQLQUERY_DS_App_User_Details,
        desc : "",
        type : "QUERY"
    },
    {
        name : SQLQUERY_DS_App_GetDataSetId_NAME,
        query :SQLQUERY_DS_App_GetDataSetId,
        desc : "",
        type : "QUERY"
    },
    {
        name : SQLQUERY_DS_App_GetOrgUnitId_NAME,
        query :SQLQUERY_DS_App_GetOrgUnitId,
        desc : "",
        type : "QUERY"
    }
];
