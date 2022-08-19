<?php
include("./models/appointment.php");
require './db/dbaccess.php';
class DataHandler
{
    public function queryAppointment()
    {
        $res =  $this->getData();
        return $res;
    }

    public function checkDuplicateChoiceUser($data) {
        global $conn;
        $data = json_decode($data);
        $sql = "SELECT id FROM choicelog WHERE username=? AND appointment_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $data[1], $data[0]);
        $stmt->execute();
        $stmt->store_result();

        return ($stmt->num_rows === 0);
    }

    public function writeChoiceLog($data) {
        global $conn;
        $data = json_decode($data);
        $sql = "INSERT INTO choicelog (appointment_id, username, choice) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('iss', $data[0], $data[1], $data[2]);

        return $stmt->execute();
    }

    public function deleteAppointmentByID($id) {
        global $conn;
        //$sql = "DELETE FROM appointments WHERE ID=?";
        $sql = "DELETE appointments, choicelog FROM appointments INNER JOIN choicelog ON appointments.id = choicelog.appointment_id WHERE appointments.id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();

        return true;
    }

    public function writeAppointment($data) {
        global $conn;
        $data = json_decode($data);
        $sql = "INSERT INTO appointments (username, title, location, duration, appointments, description) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sssiss', $data[0], $data[1], $data[2], $data[3], $data[4], $data[5]);
        $stmt->execute();

        return true;
    }

    public function queryAppointmentById($id) {
        global $conn;
        $queryData = "SELECT appointments.*, choicelog.appointment_id, choicelog.username, choicelog.choice FROM appointments LEFT JOIN choicelog ON appointments.id=choicelog.appointment_id WHERE appointments.id=?";
        $stmt = $conn->prepare($queryData);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        $data = [];

        foreach($result as $res) {
            $data['appointment'] = new Appointment($res['id'], $res['username'], $res['title'], $res['location'], $res['duration'], $res['appointments'], $res['description'], $res['start_date']);
            if($res['appointment_id'] && $res['username'] && $res['choice']) {
                $data['choice'][] = [$res['appointment_id'], $res['username'], $res['choice']];
            }
        }
        
        return $data;
    }

    /*public function queryAppointmentById($id) {
        global $conn;
        $queryData = "SELECT * FROM appointments WHERE id=? LIMIT 1";
        $stmt = $conn->prepare($queryData);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        $data = [];

        foreach($result as $res) {
            $data[] = new Appointment($res['id'], $res['username'], $res['title'], $res['location'], $res['duration'], $res['appointments'], $res['description'], $res['start_date']);
        }
        
        return $data;
    }*/

    private static function getData() {
        global $conn;
        $queryData = "SELECT * FROM appointments";
        $stmt = $conn->prepare($queryData);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        $data = [];

        foreach($result as $res) {
            $data[] = new Appointment($res['id'], $res['username'], $res['title'], $res['location'], $res['duration'], $res['appointments'], $res['description'], $res['start_date']);
        }
        
        return $data;
    }
}
