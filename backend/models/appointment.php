<?php
class Appointment {
    public $id;
    public $username;
    public $title;
    public $location;
    public $duration; // in hours
    public $appointments;
    public $description;
    public $start_date;

    function __construct($id, $username, $title, $location, $duration, $appointments, $description, $start_date) {
        $this->id = $id;
        $this->username = $username;
        $this->title=$title;
        $this->location=$location;
        $this->duration=$duration;
        $this->appointments=$appointments;
        $this->description=$description;
        $this->start_date=$start_date;
      }
}