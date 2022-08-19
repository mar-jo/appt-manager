<?php
include("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param)
    {
        switch ($method) {
            case "checkDuplicateChoiceUser":
                $res = $this->dh->checkDuplicateChoiceUser($param);
                break;
            case "queryAppointment":
                $res = $this->dh->queryAppointment();
                break;
            case "queryAppointmentById":
                $res = $this->dh->queryAppointmentById($param);
                break;
            case "writeAppointment":
                $res = $this->dh->writeAppointment($param);
                break;
            case "deleteAppointmentbyID":
                $res = $this->dh->deleteAppointmentbyID($param);
                break;
            case "writeChoiceLog":
                $res = $this->dh->writeChoiceLog($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
