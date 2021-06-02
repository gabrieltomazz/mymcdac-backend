-- options_answers 
ALTER TABLE `mymcdac`.`option_answers` 
ADD INDEX `scales_fk_idx` (`scale_id` ASC);
;
ALTER TABLE `mymcdac`.`option_answers` 
ADD CONSTRAINT `scales_fk`
  FOREIGN KEY (`scale_id`)
  REFERENCES `mymcdac`.`scales` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

---  criteria 
ALTER TABLE `mymcdac`.`criteria` 
ADD INDEX `fk_criteria_idx` (`criterion_id` ASC);
;
ALTER TABLE `mymcdac`.`criteria` 
ADD CONSTRAINT `fd_criteria`
  FOREIGN KEY (`criterion_id`)
  REFERENCES `mymcdac`.`criteria` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

-- criteria project
ALTER TABLE `mymcdac`.`criteria` 
ADD INDEX `fk_projetct_idx` (`project_id` ASC);
;
ALTER TABLE `mymcdac`.`criteria` 
ADD CONSTRAINT `fk_projetct`
  FOREIGN KEY (`project_id`)
  REFERENCES `mymcdac`.`projects` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;


  -- scale result 
ALTER TABLE `mymcdac`.`scale_results` 
ADD INDEX `fk_criteria_scale_result_idx` (`criterion_id` ASC);
;
ALTER TABLE `mymcdac`.`scale_results` 
ADD CONSTRAINT `fk_criteria_scale_result`
  FOREIGN KEY (`criterion_id`)
  REFERENCES `mymcdac`.`criteria` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

ALTER TABLE `mymcdac`.`scale_results` 
ADD CONSTRAINT `fk_option_scale_result`
  FOREIGN KEY (`option_answer_id`)
  REFERENCES `mymcdac`.`option_answers` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;