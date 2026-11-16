package com.sundtrack.catan;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(packages = "com.sundtrack.catan", importOptions = ImportOption.DoNotIncludeTests.class)
class ArchitectureTest {

    @ArchTest
    static final ArchRule domain_is_framework_and_adapter_free =
            noClasses().that().resideInAPackage("..datalayer.domain..")
                    .should().dependOnClassesThat().resideInAnyPackage(
                            "..session..", "..messaging..", "..config..", "..common..", "..activeSessions..",
                            "org.springframework..", "jakarta.persistence..");

    @ArchTest
    static final ArchRule core_domain_does_not_use_dtos =
            noClasses().that().resideInAPackage("..datalayer.domain..")
                    .and().resideOutsideOfPackage("..datalayer.domain.event..")
                    .should().dependOnClassesThat().resideInAPackage("..datalayer.dto..");
}